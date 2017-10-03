module.exports = class AssignAst {
	constructor (left, op, right) {
		this.left = left;
		this.op = op;
		this.right = right;
	}
};
