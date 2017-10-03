const Symbol = require('./Symbol');

module.exports = class VariableSymbol extends Symbol {
	constructor (name, type) {
		super(name, type);
	}

	toString () {
		return `<${this.constructor.name}(name='${name}', type='${type.toString()}')>`;
	}
};
