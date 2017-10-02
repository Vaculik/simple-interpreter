module.exports = class InputStream {
	constructor(input) {
		this.input = input;
		this.pos = 0;
		this.line = 1;
		this.col = 0;
	}

	next() {
		const c = this.input.charAt(this.pos++);

		if (c === '\n') {
			this.line++;
			this.col = 0;
		} else {
			this.col++;
		}

		return c;
	}

	peek() {
		return this.input.charAt(this.pos);
	}

	eof() {
		return this.pos >= this.input.length;
	}

	error(msg) {
		throw new Error(`${msg} (${this.line}:${col})`);
	}
};
