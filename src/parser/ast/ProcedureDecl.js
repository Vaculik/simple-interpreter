const Ast = require('parser/ast/Ast');


module.exports = class ProcedureDecl extends Ast {
	constructor (procName, params, blockNode) {
		super();

		this.procName = procName;
		this.params = params;
		this.blockNode = blockNode;
	}
};
