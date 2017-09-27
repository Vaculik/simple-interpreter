const Symbol = require('symbol/symbol-nodes/Symbol');

module.exports = class BuiltinTypeSymbol extends Symbol {
	constructor (name) {
		super(name);
	}

	toString () {
		return `<${this.constructor.name}(${this.name})>`;
	}
};
