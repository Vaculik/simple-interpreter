const Ast = require('parser/ast/Ast');


module.exports = class Param extends Ast {
	constructor (varNode, typeNode) {
		super();

		this.varNode = varNode;
		this.typeNode = typeNode;
	}
};
