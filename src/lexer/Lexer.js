const Token = require('lexer/token/Token');
const {
	INTEGER,
	PLUS,
	MINUS,
	MUL,
	DIV,
	LPAREN,
	RPAREN,
	EOF,
} = require('lexer/token/token-types');


module.exports = class Lexer {
	constructor(text) {
		this.text = text;
		this.pos = 0;
		this.currentChar = this.text[this.pos];
	}

	error () {
		throw Error('Invalid character');
	}

	advance () {
		this.pos++;
		if (this.pos > this.text.length - 1){
			this.currentChar = null;
		} else {
			this.currentChar = this.text[this.pos];
		}
	}

	skipWhitespace () {
		while (this.currentChar !== null && this._isWhitespace(this.currentChar)) {
			this.advance();
		}
	}

	integer () {
		let result = '';

		while (this.currentChar !== null && this._isDigit(this.currentChar)) {
			result += this.currentChar;
			this.advance();
		}

		return parseInt(result);
	}

	getNextToken () {
		while (this.currentChar !== null) {
			if (this._isWhitespace(this.currentChar)) {
				this.skipWhitespace();
				continue;
			}

			if (this._isDigit(this.currentChar)) {
				return new Token(INTEGER, this.integer());
			}

			if (this.currentChar === '+') {
				this.advance();
				return new Token(PLUS, '+');
			}

			if (this.currentChar === '-') {
				this.advance();
				return new Token(MINUS, '-');
			}

			if (this.currentChar === '*') {
				this.advance();
				return new Token(MUL, '*');
			}

			if (this.currentChar === '/') {
				this.advance();
				return new Token(DIV, '/');
			}

			if (this.currentChar === '(') {
				this.advance();
				return new Token(LPAREN, '(');
			}

			if (this.currentChar === ')') {
				this.advance();
				return new Token(RPAREN, ')');
			}

			this.error();
		}

		return new Token(EOF, null);
	}


	_isWhitespace (char) {
		return /^\s$/.test(char)
	}

	_isDigit (char) {
		let parsedDigit = parseInt(char, 10);

		return !isNaN(parsedDigit);
	}
};
