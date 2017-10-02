const Token = require('lexer/token/Token');
const tt = require('lexer/token/token-types');
const RESERVED_KEYWORDS = require('lexer/token/reserved-keywords');


module.exports = class Lexer {
	constructor(inputStream) {
		this.inputStream = inputStream;
	}

	error (msg) {
		this.inputStream.error(msg);
	}

	skipWhitespace () {
		while (!this.inputStream.eof() && this._isWhitespace(this.inputStream.peek())) {
			this.inputStream.next();
		}
	}

	skipComment () {
		while (this.inputStream.peek() !== '}') {
			this.inputStream.next();
		}
		this.inputStream.next();
	}

	number () {
		let result = '';

		while (this._isCurrentCharDigit()) {
			result += this.inputStream.next();
		}

		if (this.inputStream.peek() === '.') {
			result += this.inputStream.next();

			while (this._isCurrentCharDigit()) {
				result += this.inputStream.next();
			}

			return new Token(tt.REAL_CONST, parseFloat(result));
		}

		return new Token(tt.INTEGER_CONST, parseInt(result));
	}

	id() {
		let result = '';

		while (!this.inputStream.eof() && this._isLetterOrDigit(this.inputStream.peek())) {
			result += this.inputStream.next();
		}

		return RESERVED_KEYWORDS[result] || new Token(tt.ID, result);
	}

	getNextToken () {
		while (!this.inputStream.eof()) {
			if (this._isWhitespace(this.inputStream.peek())) {
				this.skipWhitespace();
				continue;
			}

			if (this._isDigit(this.inputStream.peek())) {
				return this.number();
			}

			if (this.inputStream.peek() === '+') {
				this.inputStream.next();
				return new Token(tt.PLUS, '+');
			}

			if (this.inputStream.peek() === '-') {
				this.inputStream.next();
				return new Token(tt.MINUS, '-');
			}

			if (this.inputStream.peek() === '*') {
				this.inputStream.next();
				return new Token(tt.MUL, '*');
			}

			if (this.inputStream.peek() === '/') {
				this.inputStream.next();
				return new Token(tt.DIV, '/');
			}

			if (this.inputStream.peek() === '(') {
				this.inputStream.next();
				return new Token(tt.LPAREN, '(');
			}

			if (this.inputStream.peek() === ')') {
				this.inputStream.next();
				return new Token(tt.RPAREN, ')');
			}

			if (this._isLetter(this.inputStream.peek())) {
				return this.id();
			}

			if (this.inputStream.peek() === ':' && this.peek() === '=') {
				this.inputStream.next();
				this.inputStream.next();
				return new Token(tt.ASSIGN, ':=');
			}

			if (this.inputStream.peek() === ':') {
				this.inputStream.next();
				return new Token(tt.COLON, ':');
			}

			if (this.inputStream.peek() === ';') {
				this.inputStream.next();
				return new Token(tt.SEMI, ';');
			}

			if (this.inputStream.peek() === '.') {
				this.inputStream.next();
				return new Token(tt.DOT, '.');
			}

			if (this.inputStream.peek() === '{') {
				this.inputStream.next();
				this.skipComment();
				continue;
			}

			if (this.inputStream.peek() === ',') {
				this.inputStream.next();
				return new Token(tt.COMMA, ',');
			}

			if (this.inputStream.peek() === '/') {
				this.inputStream.next();
				return new Token(tt.FLOAT_DIV, '/');
			}

			this.error('Invalid character');
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
		return !this.inputStream.eof() && this._isDigit(this.inputStream.peek());
	}
};
