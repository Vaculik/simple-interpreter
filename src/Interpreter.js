
const INTEGER = 'INTEGER';
const PLUS = 'PLUS';
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
	}

	error () {
		throw Error('Error parsing input');
	}

	getNextToken () {
		let text = this.text;

		if (this.pos > text.length - 1){
			return new Token(EOF, null);
		}

		let currentChar = text[this.pos];
		let parsedDigit = parseInt(currentChar, 10);

		if (!isNaN(parsedDigit)) {
			let token = new Token(INTEGER, parsedDigit);

			this.pos++;
			return token;
		}

		if (currentChar === '+') {
			let token = new Token(PLUS, currentChar);

			this.pos++;
			return token;
		}

		this.error();
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

		this.eat(PLUS);

		let right = this.currentToken;

		this.eat(INTEGER);

		return left.value + right.value;
	}
}


module.exports = Interpreter;