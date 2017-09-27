const tt = require('lexer/token/token-types');
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
		this.visitProgram = this._visitProgram.bind(this);
		this.visitBlock = this._visitBlock.bind(this);
	}

	visitNum (node) {
		return node.value;
	}

	visitNoOp (node) {
	}

	visitVarDecl (node) {
	}

	visitType (node) {
	}

	visitProcedureDecl (node) {

	}

	interpret () {
		const tree = this.parser.parse();

		this.visit(tree);
		console.log(this.globalScope);
	}

	_visitBinOp (node) {
		const opType = node.op.type;

		if (opType === tt.PLUS) {
			return this.visit(node.left) + this.visit(node.right);
		}

		if (opType === tt.MINUS) {
			return this.visit(node.left) - this.visit(node.right);
		}

		if (opType === tt.MUL) {
			return this.visit(node.left) * this.visit(node.right);
		}

		if (opType === tt.INTEGER_DIV) {
			const realDivResult = this.visit(node.left) / this.visit(node.right);
			return Math.floor(realDivResult);
		}

		if (opType === tt.REAL_DIV) {
			return this.visit(node.left) / this.visit(node.right);
		}
	}

	_visitUnaryOp (node) {
		const opType = node.op.type;

		if (opType === tt.PLUS) {
			return +this.visit(node.expr);
		}

		if (opType === tt.MINUS) {
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

	_visitProgram (node) {
		this.visit(node.block);
	}

	_visitBlock (node) {
		for (const declaration of node.declarations) {
			this.visit(declaration);
		}

		this.visit(node.compoundStatement);
	}
};
