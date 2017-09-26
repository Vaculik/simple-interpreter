const NodeVisitor = require('interpreter/NodeVisitor');
const SymbolTable = require('interpreter/SymbolTable');
const VarSymbol = require('interpreter/symbol/VarSymbol');


module.exports = class SymbolTableBuilder extends NodeVisitor {
	constructor () {
		super();

		this.symtab = new SymbolTable();

		this.visit = super.visit.bind(this);
		this.visitBinOp = this._visitBinOp.bind(this);
		this.visitUnaryOp = this._visitUnaryOp.bind(this);
		this.visitCompound = this._visitCompound.bind(this);
		this.visitAssign = this._visitAssign.bind(this);
		this.visitVar = this._visitVar.bind(this);
		this.visitProgram = this._visitProgram.bind(this);
		this.visitBlock = this._visitBlock.bind(this);
		this.visitVarDecl = this._visitVarDecl.bind(this);
	}


	visitProcedureDecl (node) {
	}

	visitNoOp (node) {
	}

	visitNum (node) {
	}

	_visitBlock (node) {
		for (const declaration of node.declarations) {
			this.visit(declaration);
		}

		this.visit(node.compoundStatement);
	}

	_visitProgram (node) {
		this.visit(node.block);
	}

	_visitBinOp (node) {
		this.visit(node.left);
		this.visit(node.right);
	}

	_visitUnaryOp (node) {
		this.visit(node.expr);
	}

	_visitCompound (node) {
		for (const child of node.children) {
			this.visit(child);
		}
	}

	_visitVarDecl (node) {
		const typeName = node.typeNode.value;
		const typeSymbol = this.symtab.lookup(typeName);
		const varName = node.varNode.value;
		const varSymbol = new VarSymbol(varName, typeSymbol);

		this.symtab.define(varSymbol);
	}

	_visitAssign (node) {
		const varName = node.left.value;
		const varSymbol = this.symtab.lookup(varName);

		if (!varSymbol) {
			throw new Error(`Variable ${varName} is not defined.`);
		}

		this.visit(node.right);
	}

	_visitVar (node) {
		const varName = node.value;
		const varSymbol = this.symtab.lookup(varName);

		if (!varSymbol) {
			throw new Error(`Variable ${varName} is not defined.`);
		}
	}
};
