module.exports = class VariableAst {
	constructor (token) {
		this.token = token;
		this.value = token.value;
	}
};
