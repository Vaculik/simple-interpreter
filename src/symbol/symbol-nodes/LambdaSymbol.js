const Symbol = require('./Symbol');

module.exports = class LambdaSymbol extends Symbol {
	constructor (name, params = null) {
		super(name);

		this.params = params || [];
	}

	toString () {
		return `<${this.constructor.name}(name=${this.name}, parameters=${this.params})>`;
	}
};
