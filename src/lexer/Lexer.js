const Token = require('lexer/token/Token');
const tt = require('lexer/token/token-types');
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

	skipComment () {
		while (this.currentChar !== '}') {
			this.advance();
		}
		this.advance();
	}

	number () {
		let result = '';

		while (this._isCurrentCharDigit()) {
			result += this.currentChar;
			this.advance();
		}

		if (this.currentChar === '.') {
			result += this.currentChar;
			this.advance();

			while (this._isCurrentCharDigit()) {
				result += this.currentChar;
				this.advance();
			}

			return new Token(tt.REAL_CONST, parseFloat(result));
		}

		return new Token(tt.INTEGER_CONST, parseInt(result));
	}

	id() {
		let result = '';

		while (this.currentChar !== null && this._isLetterOrDigit(this.currentChar)) {
			result += this.currentChar;
			this.advance();
		}

		return RESERVED_KEYWORDS[result] || new Token(tt.ID, result);
	}

	getNextToken () {
		while (this.currentChar !== null) {
			if (this._isWhitespace(this.currentChar)) {
				this.skipWhitespace();
				continue;
			}

			if (this._isDigit(this.currentChar)) {
				return this.number();
			}

			if (this.currentChar === '+') {
				this.advance();
				return new Token(tt.PLUS, '+');
			}

			if (this.currentChar === '-') {
				this.advance();
				return new Token(tt.MINUS, '-');
			}

			if (this.currentChar === '*') {
				this.advance();
				return new Token(tt.MUL, '*');
			}

			if (this.currentChar === '/') {
				this.advance();
				return new Token(tt.DIV, '/');
			}

			if (this.currentChar === '(') {
				this.advance();
				return new Token(tt.LPAREN, '(');
			}

			if (this.currentChar === ')') {
				this.advance();
				return new Token(tt.RPAREN, ')');
			}

			if (this._isLetter(this.currentChar)) {
				return this.id();
			}

			if (this.currentChar === ':' && this.peek() === '=') {
				this.advance();
				this.advance();
				return new Token(tt.ASSIGN, ':=');
			}

			if (this.currentChar === ':') {
				this.advance();
				return new Token(tt.COLON, ':');
			}

			if (this.currentChar === ';') {
				this.advance();
				return new Token(tt.SEMI, ';');
			}

			if (this.currentChar === '.') {
				this.advance();
				return new Token(tt.DOT, '.');
			}

			if (this.currentChar === '{') {
				this.advance();
				this.skipComment();
				continue;
			}

			if (this.currentChar === ',') {
				this.advance();
				return new Token(tt.COMMA, ',');
			}

			if (this.currentChar === '/') {
				this.advance();
				return new Token(tt.FLOAT_DIV, '/');
			}

			this.error();
		}

		return new Token(tt.EOF, null);
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

	_isLetterOrDigit (char) {
		return this._isDigit(char) || this._isLetter(char);
	}

	_isCurrentCharDigit () {
		return this.currentChar !== null && this._isDigit(this.currentChar);
	}
};
