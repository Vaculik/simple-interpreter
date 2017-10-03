const tt = require('../lexer/token/token-types');
const reservedKeywords = require('../lexer/token/reserved-keywords');
const PRECEDENCE = require('./operator-precedence');
const LambdaAst = require('./ast/LambdaAst');
const ConditionAst = require('./ast/ConditionAst');
const LambdaCallAst = require('./ast/LambdaCallAst');
const BooleanAst = require('./ast/BooleanAst');
const AssignAst = require('./ast/AssignAst');
const BinaryAst = require('./ast/BinaryAst');
const VariableAst = require('./ast/VariableAst');
const BlockAst = require('./ast/BlockAst');
const StringAst = require('./ast/StringAst');
const NumberAst = require('./ast/NumberAst');


module.exports = class Parser {
	constructor (lexer) {
		this.lexer = lexer;

		this._parseExpression = this._parseExpression.bind(this);
		this._parseVariableName = this._parseVariableName.bind(this);
	}

	parse () {
        const expressions = [];

        while (!this.lexer.eof()) {
            expressions.push(this._parseExpression());

            if (!this.lexer.eof()) {
                this._eatPunc(';');
            }
        }

        return new BlockAst(expressions);
    }

	_parseLambda () {
	    const params = this._delimited('(', ')', ',', this._parseVariableName);
	    const body = this._parseExpression();

	    return new LambdaAst(params, body);
    }

    _parseVariableName () {
	    const nameToken = this.lexer.next();

	    if (nameToken.type !== tt.VAR) {
	        this.lexer.error('Expecting variable name');
        }

        return nameToken.value;
    }

    _parseIf () {
	    this._eatKeyword('if');
	    const condition = this._parseExpression();

	    if (!this._isPunc('{')) {
	        this._eatKeyword('then');
        }
        const thenBody = this._parseExpression();

	    if (this._isKeyword('else')) {
	        this.lexer.next();
            const elseBody = this._parseExpression();

            return new ConditionAst(condition, thenBody, elseBody);
        }

        return new ConditionAst(condition, thenBody);
    }

    _parseAtom () {
	    return this._parseMaybeCall(() => {
	        if (this._isPunc('(')) {
	            this.lexer.next();
	            const expression = this._parseExpression();

	            this._eatPunc(')');
	            return expression;
            }
            if (this._isPunc('{')) {
	            return this._parseBlock();
            }
            if (this._isKeyword('if')) {
	            return this._parseIf();
            }
            if (this._isKeyword('true') || this._isKeyword('false')) {
	            return this._parseBool();
            }
            if (this._isKeyword('lambda')) {
	            this.lexer.next();
                return this._parseLambda();
            }

            const token = this.lexer.next();

	        if (token.type === tt.VAR) {
	            return new VariableAst(token);
            }
            if (token.type === tt.NUM) {
                return new NumberAst(token);
            }
            if (token.type === tt.STR) {
                return new StringAst(token);
            }

            this._throwUnexpectedToken(token);
        })
    }

    _parseBool () {
	    const value = this.lexer.next().value === 'true';

	    return new BooleanAst(value);
    }

    _parseBlock () {
	    const expressions = this._delimited('{', '}', ';', this._parseExpression);

	    if (expressions.length === 0) {
	        return reservedKeywords.false;
        }
        if (expressions.length === 1) {
	        return expressions[0];
        }

        return new BlockAst(expressions)
    }

    _parseExpression () {
	    return this._parseMaybeCall(() => this._parseMaybeBinary(this._parseAtom(), 0));
    }

    _parseMaybeCall (expressionParser) {
	    const expression = expressionParser();

	    return this._isPunc('(') ? this._parseCall(expression) : expression;
    }

    _parseCall (func) {
	    const args = this._delimited('(', ')', ',', this._parseExpression);

	    return new LambdaCallAst(func, args);
    }

    _parseMaybeBinary (left, myPrecedence) {
	    const token = this.lexer.peek();

	    if (token.type === tt.OP) {
	        const hisPrecedence = PRECEDENCE[token.value];

	        if (hisPrecedence > myPrecedence) {
	            this.lexer.next();
	            const right = this._parseMaybeBinary(this._parseAtom(), hisPrecedence);
	            const astByType = token.value === '=' ? AssignAst : BinaryAst;
	            const binary = new astByType(left, token.value, right);

                return this._parseMaybeBinary(binary, myPrecedence);
            }
        }

        return left;
    }

    _delimited (start, stop, separator, parser) {
	    const parsedValues = [];
	    let first = true;

	    this._eatPunc(start);

	    while (!this.lexer.eof()) {
	        const isPunc = this._isPunc(stop);
	        if (isPunc) {
	            break;
            }
            if (first) {
	            first = false;
            } else {
	            this._eatPunc(separator);
            }
            if (this._isPunc(stop)) {
	            break;
            }

            parsedValues.push(parser());
        }

        this._eatPunc(stop);

	    return parsedValues;
    }

    _isPunc (c) {
	    const token = this.lexer.peek();

	    return token && token.type === tt.PUNC && token.value === c;
    }

    _isKeyword (keyword) {
	    const token = this.lexer.peek();

	    return token && token.type === tt.KW && token.value === keyword;
    }

    _isOperator (op) {
	    const token = this.lexer.peek();

	    return token && token.type === tt.OP && token.value === op;
    }

    _eatPunc (c) {
	    if (this._isPunc(c)) {
	        this.lexer.next();
        } else {
	        this.lexer.error(`Expecting punctuation: "${c}"`);
        }
    }

    _eatKeyword (keyword) {
	    if (this._isKeyword(keyword)) {
	        this.lexer.next();
        } else {
	        this.lexer.error(`Expecting keyword: "${keyword}"`);
        }
    }

    _eatOperator (op) {
	    if (this._isOperator(op)) {
	        this.lexer.next();
        } else {
	        this.lexer.error(`Expecting operator: "${op}"`);
        }
    }

    _throwUnexpectedToken (token) {
	    this.lexer.error(`Unexpected token: ${token.toString()}`);
    }
};
