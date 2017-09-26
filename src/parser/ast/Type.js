const Ast = require('parser/ast/Ast');


module.exports = class Type extends Ast {
	constructor (token) {
		super();

		this.token = token;
		this.value = token.value;
	}
};
