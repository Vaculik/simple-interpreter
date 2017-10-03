const BuiltinTypeSymbol = require('./symbol-nodes/BuiltinTypeSymbol');

module.exports = class ScopedSymbolTable {
	constructor (scopeName, scopeLevel, enclosingScope = null) {
		this._symbols = new Map();
		this.scopeName = scopeName;
		this.scopeLevel = scopeLevel;
		this.enclosingScope = enclosingScope;
}

	toString () {
		const symtabHeader = 'SCOPE (SCOPED SYMBOL TABLE)';
		const divider = '---------------------------';
		const scopeName = `Scope name: ${this.scopeName}`;
		const scopeLevel = `Scope level: ${this.scopeLevel}`;
		const lines = ['\n', symtabHeader, divider, scopeName, scopeLevel, divider];

		for (const { key, value } of this._symbols.entries()) {
			const newLine = `${key}: ${value.toString()}`;

			lines.push(newLine);
		}

		lines.push('\n');

		return lines.join('\n');
	}

	extend () {
	    return new ScopedSymbolTable('lambda', this.scopeLevel + 1, this);
    }

	insert (symbol) {
		this._symbols.set(symbol.name, symbol);
	}

	lookup (name, currentScopeOnly = false) {
		const symbol = this._symbols.get(name);

		if (symbol) {
			return symbol;
		}

		if (currentScopeOnly) {
			return undefined;
		}

		if (this.enclosingScope) {
			return this.enclosingScope.lookup(name);
		}
	}

	initBuiltins () {
		this.insert(new BuiltinTypeSymbol('INTEGER'));
		this.insert(new BuiltinTypeSymbol('REAL'));
	}
};
