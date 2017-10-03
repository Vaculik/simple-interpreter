const Token = require('./token/Token');
const tt = require('./token/token-types');
const RESERVED_KEYWORDS = require('./token/reserved-keywords');


module.exports = class Lexer {
	constructor(inputStream) {
		this.inputStream = inputStream;
		this.current = null;
	}

	error (msg) {
		this.inputStream.error(msg);
	}

    peek() {
        if (!this.current) {
            this.current = this._getNextToken();
        }
        return this.current;
    }

    next() {
        let token = this.current;

        this.current = null;
        return token || this._getNextToken();
    }

    eof() {
        return this.peek() === null;
    }

	_skipComment () {
		this._readWhile((c) => c !== '\n');
		this.inputStream.next();
	}

	_readNumber () {
		let hasDot = false;
		const number = this._readWhile((c) => {
			if (c === '.') {
				if (hasDot) {
					return false;
				}
				hasDot = true;
				return true;
			}
			return this._isDigit(c);
		});

		return new Token(tt.NUM, parseFloat(number));
	}

	_readId () {
		const id = this._readWhile(this._isId.bind(this));

		return RESERVED_KEYWORDS[id] || new Token(tt.VAR, id);
	}

	_readString () {
		const value = this._readEscaped('"');

		return new Token(tt.STR, value);
	}

	_readEscaped (end) {
		let excaped = false;
		let str = '';

		this.inputStream.next();
		while (!this.inputStream.eof()) {
			let c = this.inputStream.next();

			if (excaped) {
				str += c;
				excaped = false;
			} else if (c === '\\') {
				excaped = true;
			} else if (c === end) {
				break;
			} else {
				str += c;
			}
		}

		return str;
	}

	_readWhile (predicate) {
		let str = '';

		while (!this.inputStream.eof() && predicate(this.inputStream.peek())) {
			str += this.inputStream.next();
		}
		return str;
	}

	_getNextToken () {
		this._readWhile(this._isWhitespace);
		if (this.inputStream.eof()) {
			return null;
		}

		const c = this.inputStream.peek();

		if (c === '#') {
			this._skipComment();
			return this._getNextToken();
		}
		if (c === '"') {
			return this._readString();
		}
		if (this._isDigit(c)) {
			return this._readNumber();
		}
		if (this._isIdStart(c)) {
			return this._readId();
		}
		if (this._isPunc(c)) {
			return new Token(tt.PUNC, this.inputStream.next());
		}
		if (this._isOpChar(c)) {
			const op = this._readWhile(this._isOpChar);

			return new Token(tt.OP, op);
		}

		this.error(`Cannot handle character: ${c}`);
	}

	_isWhitespace (char) {
		return /^\s$/.test(char);
	}

	_isDigit (char) {
		return /[0-9]/i.test(char);
	}

	_isIdStart (char) {
		return /[a-zA-Z_]/i.test(char);
	}

	_isId (char) {
		return this._isIdStart(char) || this._isDigit(char);
	};

	_isOpChar (char) {
		return '+-*/%=&|<>!'.indexOf(char) >= 0;
	}

	_isPunc (char) {
		return ',;(){}[]'.indexOf(char) >= 0;
	}
};
