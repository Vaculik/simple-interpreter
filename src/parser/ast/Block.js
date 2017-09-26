const Ast = require('parser/ast/Ast');


module.exports = class Block extends Ast {
	constructor (declarations, compoundStatement) {
		super();

		this.declarations = declarations;
		this.compoundStatement = compoundStatement;
	}
};
