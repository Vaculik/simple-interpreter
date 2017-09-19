const Ast = require('parser/ast/Ast');


module.exports = class Assign extends Ast {
	constructor (left, op, right) {
		super();

		this.left = left;
		this.op = op;
		this.token = this.op;
		this.right = right;const Ast = require('parser/ast/Ast');


		module.exports = class Compound extends Ast {
			constructor () {
				super();

				this.children = [];
			}
		};

	}
};
