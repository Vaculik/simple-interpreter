const {
	PLUS,
	MINUS,
	MUL,
	DIV,
} = require('lexer/token/token-types');
const NodeVisitor = require('interpreter/NodeVisitor');


module.exports = class Interpreter extends NodeVisitor {
	constructor (parser) {
		super();

		this.parser = parser;
		this.visit = super.visit.bind(this);
		this.visitBinOp = this._visitBinOp.bind(this);
	}

	visitNum (node) {
		return node.value;
	}

	interpret () {
		const tree = this.parser.parse();

		return this.visit(tree);
	}

	_visitBinOp (node) {
		if (node.op.type === PLUS) {
			return this.visit(node.left) + this.visit(node.right);
		}

		if (node.op.type === MINUS) {
			return this.visit(node.left) - this.visit(node.right);
		}

		if (node.op.type === MUL) {
			return this.visit(node.left) * this.visit(node.right);
		}

		if (node.op.type === DIV) {
			return this.visit(node.left) / this.visit(node.right);
		}
	}
};
