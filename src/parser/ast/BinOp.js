const Ast = require('parser/ast/Ast');


module.exports = class BinOp extends Ast {
	constructor (left, op, right) {
		super();

		this.left = left;
		this.op = op;
		this.token = this.op;
		this.right = right;
	}
};
