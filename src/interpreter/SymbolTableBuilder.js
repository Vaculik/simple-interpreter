const NodeVisitor = require('interpreter/NodeVisitor');
const SymbolTable = require('interpreter/SymbolTable');
const VarSymbol = require('interpreter/symbol/VarSymbol');


module.exports = class SymbolTableBuilder extends NodeVisitor {
	constructor () {
		super();

		this.symtab = new SymbolTable();

		this.visit = super.visit.bind(this);
	}

	visitBlock (node) {
		for (const declaration of node.declarations) {
			this.visit(declaration);
		}

		this.visit(node.compoundStatement);
	}

	visitProgram (node) {
		this.visit(node.block);
	}

	visitBinOp (node) {
		this.visit(node.left);
		this.visit(node.right);
	}

	visitNum (node) {
	}

	visitUnaryOp (node) {
		this.visit(node.expr);
	}

	visitCompound (node) {
		for (const child of node.children) {
			this.visit(child);
		}
	}

	visitNoOp (node) {
	}

	visitVarDecl (node) {
		const typeName = node.typeNode.value;
		const typeSymbol = this.symtab.lookup(typeName);
		const varName = node.varNode.value;
		const varSymbol = new VarSymbol(varName, typeSymbol);

		this.symtab.define(varSymbol);
	}

	visitAssign (node) {
		const varName = node.left.value;
		const varSymbol = this.symtab.lookup(varName);

		if (!varSymbol) {
			throw new Error(`Variable ${varName} is not defined.`);
		}

		this.visit(node.right);
	}

	visitVar (node) {
		const varName = node.value;
		const varSymbol = this.symtab.lookup(varName);

		if (!varSymbol) {
			throw new Error(`Variable ${varName} is not defined.`);
		}
	}
};
