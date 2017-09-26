const Ast = require('parser/ast/Ast');


module.exports = class Program extends Ast {
	constructor (name, block) {
		super();

		this.name = name;
		this.block = block;
	}
};
