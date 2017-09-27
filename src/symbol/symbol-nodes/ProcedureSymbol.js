const Symbol = require('symbol/symbol-nodes/Symbol');

module.exports = class ProcedureSymbol extends Symbol {
	constructor (name, params = null) {
		super(name);

		this.params = params || [];
	}

	toString () {
		return `<${this.constructor.name}(name=${this.name}, parameters=${this.params})>`;
	}
};
