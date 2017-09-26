const Ast = require('parser/ast/Ast');


module.exports = class VarDecl extends Ast {
	constructor (varNode, typeNode) {
		super();

		this.varNode = varNode;
		this.typeNode = typeNode;
	}
};
