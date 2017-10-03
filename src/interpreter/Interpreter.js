const tt = require('../lexer/token/token-types');
const NodeVisitor = require('./NodeVisitor');
const VariableAst = require('../parser/ast/VariableAst');
const Environment = require('./Environment');


module.exports = class Interpreter extends NodeVisitor {
	constructor (astTree) {
		super();

		this.astTree = astTree;
        this.currentEnv = null;
	}

	evaluate() {
	    this.currentEnv = new Environment(this.currentEnv);
	    this.currentEnv.defPrimitives();

	    return this.visit(this.astTree);
    }

	visitBlockAst (node) {
        let result = false;

        node.expressions.forEach((exp) => result = this.visit(exp));

        return result;
    }

	visitNumberAst (node) {
		return node.value;
	}

	visitStringAst (node) {
		return node.value;
	}

	visitBooleanAst (node) {
	    return node.value;
    }

	visitVariableAst (node) {
        const varName = node.value;
        const value = this.currentEnv.lookup(varName);

        if (value === undefined) {
            throw new Error(`Unknown variable "${varName}"`);
        }

        return value;
	}

	visitAssignAst (node) {
	    if (!(node.left instanceof VariableAst)) {
	        throw new Error('Cannot assign to ' + JSON.stringify(node.left));
        }

        const varName = node.left.value;
        const valueToAssign = this.visit(node.right);

	    this.currentEnv.insert(varName, valueToAssign);
    }

    visitBinaryAst (node) {
	    const leftValue = this.visit(node.left);
	    const rightValue = this.visit(node.right);

	    return this._applyOperator(node.op, leftValue, rightValue);
    }

    visitLambdaAst (node) {
	    return this._makeLambda (node);
    }

    visitConditionAst (node) {
	    const conditionResult = this.visit(node.condition);

	    if (conditionResult !== false) {
	        return this.visit(node.thenBody);
        }
        return node.elseBody ? this.visit(node.elseBody) : false;
    }

    visitLambdaCallAst (node) {
	    const func = this.visit(node.func);
	    const args = node.args.map((arg) => this.visit(arg));

	    return func(...args);
    }

    _applyOperator (op, a, b) {
        function num(x) {
            if (typeof x != "number")
                throw new Error("Expected number but got " + x);
            return x;
        }
        function div(x) {
            if (num(x) == 0)
                throw new Error("Divide by zero");
            return x;
        }
        switch (op) {
            case "+"  : return num(a) + num(b);
            case "-"  : return num(a) - num(b);
            case "*"  : return num(a) * num(b);
            case "/"  : return num(a) / div(b);
            case "%"  : return num(a) % div(b);
            case "&&" : return a !== false && b;
            case "||" : return a !== false ? a : b;
            case "<"  : return num(a) < num(b);
            case ">"  : return num(a) > num(b);
            case "<=" : return num(a) <= num(b);
            case ">=" : return num(a) >= num(b);
            case "==" : return a === b;
            case "!=" : return a !== b;
        }
        throw new Error("Can't apply operator " + op);
    }

    _makeLambda (node) {
	    function lambda () {
	        const params = node.params;

	        this.currentEnv = this.currentEnv.extend();
	        for (let i = 0; i < params.length; i++) {
	            const paramValue = i < arguments.length ? arguments[i] : false;

	            this.currentEnv.insert(params[i], paramValue);
            }
            const result = this.visit(node.body);

	        this.currentEnv = this.currentEnv.parent;
	        return result;
        }

        return lambda.bind(this);
    }
};
