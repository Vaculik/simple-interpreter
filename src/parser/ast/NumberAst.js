module.exports = class NumberAst {
	constructor (token) {
		this.token = token;
		this.value = token.value;
	}
};
