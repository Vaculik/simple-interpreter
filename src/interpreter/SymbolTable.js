const BuiltinTypeSymbol = require('interpreter/symbol/BuiltinTypeSymbol');

module.exports = class SymbolTable {
	constructor () {
		this._symbols = new Map();
		this._initBuiltins();
	}

	toString () {
		let symbolsStr = '';

		for (const symbol of this._symbols.values()) {
			symbolsStr = `${symbolsStr}, ${symbol.toString()}`;
		}

		return `Symbols: [${symbolsStr}]`;
	}

	define (symbol) {
		this._symbols.set(symbol.name, symbol);
	}

	lookup (name) {
		return this._symbols.get(name);
	}

	_initBuiltins () {
		this.define(new BuiltinTypeSymbol('INTEGER'));
		this.define(new BuiltinTypeSymbol('REAL'));
	}
};
