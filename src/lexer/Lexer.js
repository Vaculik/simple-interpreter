const Token = require('lexer/token/Token');
const {
	INTEGER,
	PLUS,
	MINUS,
	MUL,
	DIV,
	LPAREN,
	RPAREN,
	ID,
	ASSIGN,
	SEMI,
	DOT,
	EOF,
} = require('lexer/token/token-types');
const RESERVED_KEYWORDS = require('lexer/token/reserved-keywords');


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

	peek() {
		const peekPos = this.pos + 1;

		if (peekPos > this.text.length) {
			return null;
		} else {
			return this.text[peekPos];
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

	id() {
		let result = '';

		while (this.currentChar !== null && this._isLetter(this.currentChar)) {
			result += this.currentChar;
			this.advance();
		}

		return RESERVED_KEYWORDS[result] || new Token(ID, result);
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

			if (this._isLetter(this.currentChar)) {
				return this.id();
			}

			if (this.currentChar === ':' && this.peek() === '=') {
				this.advance();
				this.advance();
				return new Token(ASSIGN, ':=');
			}

			if (this.currentChar === ';') {
				this.advance();
				return new Token(SEMI, ';');
			}

			if (this.currentChar === '.') {
				this.advance();
				return new Token(DOT, '.');
			}

			this.error();
		}

		return new Token(EOF, null);
	}


	_isWhitespace (char) {
		return /^\s$/.test(char);
	}

	_isDigit (char) {
		let parsedDigit = parseInt(char, 10);

		return !isNaN(parsedDigit);
	}

	_isLetter (char) {
		return /^[a-zA-Z]$/.test(char);
	}
};
