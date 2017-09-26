const Symbol = require('interpreter/symbol/Symbol');

module.exports = class VarSymbol extends Symbol {
	constructor (name, type) {
		super(name, type);
	}

	toString () {
		return `<${name}:${type.toString()}>`;
	}
};
