const tt = require('lexer/token/token-types');
const Num = require('parser/ast/Num');
const BinOp = require('parser/ast/BinOp');
const UnaryOp = require('parser/ast/UnaryOp');
const Compound = require('parser/ast/Compound');
const Assign = require('parser/ast/Assign');
const Var = require('parser/ast/Var');
const NoOp = require('parser/ast/NoOp');
const Block = require('parser/ast/Block');
const VarDecl = require('parser/ast/VarDecl');
const Type = require('parser/ast/Type');
const Program = require('parser/ast/Program');



module.exports = class Parser {
	constructor (lexer) {
		this.lexer = lexer;
		this.currentToken = this.lexer.getNextToken();
	}

	error () {
		throw Error('Invalid syntax');
	}

	eat (tokenType) {
		if (this.currentToken.type === tokenType) {
			this.currentToken = this.lexer.getNextToken();
		} else {
			this.error();
		}
	}

	factor () {
		const token = this.currentToken;

		if (token.type === tt.PLUS) {
			this.eat(tt.PLUS);
			return new UnaryOp(token, this.factor());
		} else if (token.type === tt.MINUS) {
			this.eat(tt.MINUS);
			return new UnaryOp(token, this.factor());
		} else if (token.type === tt.INTEGER_CONST) {
			this.eat(tt.INTEGER_CONST);
			return new Num(token);
		} else if (token.type === tt.REAL_CONST) {
			this.eat(tt.REAL_CONST);
			return new Num(token);
		} else if (token.type === tt.LPAREN) {
			this.eat(tt.LPAREN);
			const node = this.expr();

			this.eat(tt.RPAREN);
			return node;
		} else {
			return this.variable();
		}
	}

	term () {
		let node = this.factor();

		while ([tt.MUL, tt.INTEGER_DIV, tt.FLOAT_DIV].indexOf(this.currentToken.type) >= 0) {
			const token = this.currentToken;

			if (token.type === tt.MUL) {
				this.eat(tt.MUL);
			} else if (token.type === tt.INTEGER_DIV) {
				this.eat(tt.INTEGER_DIV);
			} else if (token.type === tt.FLOAT_DIV) {
				this.eat(tt.FLOAT_DIV);
			}

			node = new BinOp(node, token, this.factor());
		}

		return node;
	}

	expr () {
		let node = this.term();

		while ([tt.PLUS, tt.MINUS].indexOf(this.currentToken.type) >= 0) {
			const token = this.currentToken;

			if (token.type === tt.PLUS) {
				this.eat(tt.PLUS);
			} else if (token.type === tt.MINUS) {
				this.eat(tt.MINUS);
			}

			node = new BinOp(node, token, this.term());
		}

		return node;
	}

	program () {
		this.eat(tt.PROGRAM);

		const varNode = this.variable();
		const progName = varNode.value;

		this.eat(tt.SEMI);

		const blockNode = this.block();
		const programNode = new Program(progName, blockNode);

		this.eat(tt.DOT);
		return programNode;
	}

	compoundStatement () {
		this.eat(tt.BEGIN);
		const nodes = this.statementList();

		this.eat(tt.END);
		const root = new Compound();

		for (const node of nodes) {
			root.children.push(node);
		}

		return root;
	}

	statementList () {
		const node = this.statement();
		const results = [node];

		while (this.currentToken.type === tt.SEMI) {
			this.eat(tt.SEMI);
			results.push(this.statement());
		}

		if (this.currentToken.type === tt.ID) {
			this.error();
		}

		return results;
	}

	statement () {
		let node = null;

		if (this.currentToken.type === tt.BEGIN) {
			node = this.compoundStatement();
		} else if (this.currentToken.type === tt.ID) {
			node = this.assignmentStatement();
		} else {
			node = this.empty();
		}

		return node;
	}

	assignmentStatement () {
		const left = this.variable();
		const token = this.currentToken;

		this.eat(tt.ASSIGN);
		const right = this.expr();

		return new Assign(left, token, right);
	}

	variable () {
		const node = new Var(this.currentToken);

		this.eat(tt.ID);
		return node;
	}

	empty () {
		return new NoOp();
	}

	block () {
		const declarationNodes = this.declarations();
		const compoundStatementNode = this.compoundStatement();

		return new Block(declarationNodes, compoundStatementNode);
	}

	declarations () {
		const declarations = [];

		if (this.currentToken.type === tt.VAR) {
			this.eat(VAR);
			while (this.currentToken.type === tt.ID) {
				const varDecl = this.variableDeclaration();

				declarations.push(varDecl);
				this.eat(SEMI);
			}
		}

		return declarations;
	}

	variableDeclaration () {
		const varNodes = [new Var(this.currentToken)];

		this.eat(tt.ID);

		while (this.currentToken.type === tt.COMMA) {
			this.eat(tt.COMMA);
			varNodes.push(new Var(this.currentToken));
			this.eat(ID)
		}

		const typeNode = this.typeSpec();
		const varDeclarations = varNodes.map((varNode) => new VarDecl(varNode, typeNode));

		return varDeclarations;
	}

	typeSpec() {
		const token = this.currentToken;

		if (this.currentToken.type === tt.INTEGER) {
			this.eat(tt.INTEGER);
		} else {
			this.eat(tt.REAL);
		}

		return new Type(token);
	}

	parse () {
		const node = this.program();

		if (this.currentToken.type !== tt.EOF) {
			this.error();
		}
		return node;
	}
};
