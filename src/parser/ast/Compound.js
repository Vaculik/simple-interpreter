const Ast = require('parser/ast/Ast');


module.exports = class Compound extends Ast {
	constructor () {
		super();

		this.children = [];
	}
};
