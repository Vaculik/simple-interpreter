const Ast = require('parser/ast/Ast');


module.exports = class Var extends Ast {
	constructor (token) {
		super();

		this.token = token;
		this.value = token.value;
	}
};
