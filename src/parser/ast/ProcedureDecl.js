const Ast = require('parser/ast/Ast');


module.exports = class ProcedureDecl extends Ast {
	constructor (procName, blockNode) {
		super();

		this.procName = procName;
		this.blockNode = blockNode;
	}
};
