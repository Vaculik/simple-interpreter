
const INTEGER = 'INTEGER';
const PLUS = 'PLUS';
const MINUS = 'MINUS';
const EOF = 'EFO';

class Token {
	constructor (type, value) {
		this.type = type;
		this.value = value;
	}

	toString () {
		return `Token(${this.type}, ${this.value})`;
	}
}

class Interpreter {
	constructor (text) {
		this.text = text;
		this.pos = 0;
		this.currentToken = null;
		this.currentChar = this.text[this.pos];
	}

	error () {
		throw Error('Error parsing input');
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

			this.error();
		}

		return new Token(EOF, null);
	}

	eat (tokenType) {
		if (this.currentToken.type === tokenType) {
			this.currentToken = this.getNextToken();
		} else {
			this.error();
		}
	}

	expr () {
		this.currentToken = this.getNextToken();

		let left = this.currentToken;

		this.eat(INTEGER);

		let op = this.currentToken;

		if (op.type === PLUS) {
			this.eat(PLUS);
		} else {
			this.eat(MINUS);
		}

		let right = this.currentToken;

		this.eat(INTEGER);

		if (op.type === PLUS) {
			return left.value + right.value;
		} else {
			return left.value - right.value;
		}
	}

	_isWhitespace (char) {
		return /^\s$/.test(char)
	}

	_isDigit (char) {
		let parsedDigit = parseInt(char, 10);

		return !isNaN(parsedDigit);
	}
}


module.exports = Interpreter;