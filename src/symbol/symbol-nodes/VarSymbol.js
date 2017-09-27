const Symbol = require('symbol/symbol-nodes/Symbol');

module.exports = class VarSymbol extends Symbol {
	constructor (name, type) {
		super(name, type);
	}

	toString () {
		return `<${this.constructor.name}(name='${name}', type='${type.toString()}')>`;
	}
};
