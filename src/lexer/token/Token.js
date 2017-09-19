module.exports = class Token {
	constructor (type, value) {
		this.type = type;
		this.value = value;
	}

	toString () {
		return `Token(${this.type}, ${this.value})`;
	}
};
