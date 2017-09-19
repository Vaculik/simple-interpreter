const {
	INTEGER,
	PLUS,
	MINUS,
	MUL,
	DIV,
	LPAREN,
	RPAREN,
} = require('lexer/token/token-types');
const Num = require('parser/ast/Num');
const BinOp = require('parser/ast/BinOp');


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

		if (token.type === INTEGER) {
			this.eat(INTEGER);
			return new Num(token);
		} else if (token.type === LPAREN) {
			this.eat(LPAREN);
			const node = this.expr();

			this.eat(RPAREN);
			return node;
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

	parse() {
		return this.expr();
	}
};
