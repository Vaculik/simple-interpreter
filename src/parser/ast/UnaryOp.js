const Ast = require('parser/ast/Ast');


module.exports = class UnaryOp extends Ast {
	constructor (op, expr) {
		super();

		this.op = op;
		this.token = this.op;
		this.expr = expr;
	}
};
