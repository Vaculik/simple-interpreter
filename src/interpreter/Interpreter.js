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
		this.globalScope = {};

		this.visit = super.visit.bind(this);
		this.visitBinOp = this._visitBinOp.bind(this);
		this.visitUnaryOp = this._visitUnaryOp.bind(this);
		this.visitCompound = this._visitCompound.bind(this);
		this.visitAssign = this._visitAssign.bind(this);
		this.visitVar = this._visitVar.bind(this);
	}

	visitNum (node) {
		return node.value;
	}

	visitNoOp (node) {
	}

	interpret () {
		const tree = this.parser.parse();

		this.visit(tree);
		console.log(this.globalScope);
	}

	_visitBinOp (node) {
		const opType = node.op.type;

		if (opType === PLUS) {
			return this.visit(node.left) + this.visit(node.right);
		}

		if (opType === MINUS) {
			return this.visit(node.left) - this.visit(node.right);
		}

		if (opType === MUL) {
			return this.visit(node.left) * this.visit(node.right);
		}

		if (opType === DIV) {
			return this.visit(node.left) / this.visit(node.right);
		}
	}

	_visitUnaryOp (node) {
		const opType = node.op.type;

		if (opType === PLUS) {
			return +this.visit(node.expr);
		}

		if (opType === MINUS) {
			return -this.visit(node.expr);
		}
	}

	_visitCompound (node) {
		for (const child of node.children) {
			this.visit(child);
		}
	}

	_visitAssign (node) {
		const varName = node.left.value;

		this.globalScope[varName] = this.visit(node.right);
	}

	_visitVar (node) {
		const varName = node.value;
		const value = this.globalScope[varName];

		if (value === undefined) {
			throw Error('Unknown variable');
		}

		return value;
	}
};
