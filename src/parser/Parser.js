const {
	INTEGER,
	PLUS,
	MINUS,
	MUL,
	DIV,
	LPAREN,
	RPAREN,
	DOT,
	SEMI,
	ID,
	BEGIN,
	END,
	ASSIGN,
	EOF,
} = require('lexer/token/token-types');
const Num = require('parser/ast/Num');
const BinOp = require('parser/ast/BinOp');
const UnaryOp = require('parser/ast/UnaryOp');
const Compound = require('parser/ast/Compound');
const Assign = require('parser/ast/Assign');
const Var = require('parser/ast/Var');
const NoOp = require('parser/ast/NoOp');


module.exports = class Parser {
	constructor (lexer) {
		this.lexer = lexer;
		this.currentToken = this.lexer.getNextToken();
	}

	error() {
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

		if (token.type === PLUS) {
			this.eat(PLUS);
			return new UnaryOp(token, this.factor());
		} else if (token.type === MINUS) {
			this.eat(MINUS);
			return new UnaryOp(token, this.factor());
		} else if (token.type === INTEGER) {
			this.eat(INTEGER);
			return new Num(token);
		} else if (token.type === LPAREN) {
			this.eat(LPAREN);
			const node = this.expr();

			this.eat(RPAREN);
			return node;
		} else {
			return this.variable();
		}
	}

	term () {
		let node = this.factor();

		while ([MUL, DIV].indexOf(this.currentToken.type) >= 0) {
			const token = this.currentToken;

			if (token.type === MUL) {
				this.eat(MUL);
			} else if (token.type === DIV) {
				this.eat(DIV);
			}

			node = new BinOp(node, token, this.factor());
		}

		return node;
	}

	expr () {
		let node = this.term();

		while ([PLUS, MINUS].indexOf(this.currentToken.type) >= 0) {
			const token = this.currentToken;

			if (token.type === PLUS) {
				this.eat(PLUS);
			} else if (token.type === MINUS) {
				this.eat(MINUS);
			}

			node = new BinOp(node, token, this.term());
		}

		return node;
	}

	program() {
		const node = this.compoundStatement();

		this.eat(DOT);
		return node;
	}

	compoundStatement() {
		this.eat(BEGIN);
		const nodes = this.statementList();

		this.eat(END);
		const root = new Compound();

		for (const node of nodes) {
			root.children.push(node);
		}

		return root;
	}

	statementList() {
		const node = this.statement();
		const results = [node];

		while (this.currentToken.type === SEMI) {
			this.eat(SEMI);
			results.push(this.statement());
		}

		if (this.currentToken.type === ID) {
			this.error();
		}

		return results;
	}

	statement() {
		let node = null;

		if (this.currentToken.type === BEGIN) {
			node = this.compoundStatement();
		} else if (this.currentToken.type === ID) {
			node = this.assignmentStatement();
		} else {
			node = this.empty();
		}

		return node;
	}

	assignmentStatement() {
		const left = this.variable();
		const token = this.currentToken;

		this.eat(ASSIGN);
		const right = this.expr();

		return new Assign(left, token, right);
	}

	variable() {
		const node = new Var(this.currentToken);

		this.eat(ID);
		return node;
	}

	empty() {
		return new NoOp();
	}

	parse() {
		const node = this.program();

		if (this.currentToken.type !== EOF) {
			this.error();
		}
		return node;
	}
};
