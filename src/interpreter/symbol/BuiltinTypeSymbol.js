const Symbol = require('interpreter/symbol/Symbol');

module.exports = class BuiltinTypeSymbol extends Symbol {
	constructor (name) {
		super(name);
	}

	toString () {
		return this.name;
	}
};
