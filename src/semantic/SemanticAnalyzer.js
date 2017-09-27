const NodeVisitor = require('interpreter/NodeVisitor');
const ScopedSymbolTable = require('symbol/ScopedSymbolTable');
const VarSymbol = require('symbol/symbol-nodes/VarSymbol');
const ProcedureSymbol = require('symbol/symbol-nodes/ProcedureSymbol');


module.exports = class SemanticAnalyzer extends NodeVisitor {
	constructor () {
		super();

		this.currentScope = null;

		this.visit = super.visit.bind(this);
		this.visitCompound = this._visitCompound.bind(this);
		this.visitProgram = this._visitProgram.bind(this);
		this.visitBlock = this._visitBlock.bind(this);
		this.visitVarDecl = this._visitVarDecl.bind(this);
		this.visitVar = this._visitVar.bind(this);
		this.visitBinOp = this._visitBinOp.bind(this);
		this.visitAssign = this._visitAssign.bind(this);
		this.visitProcedureDecl = this._visitProcedureDecl.bind(this);
	}

	visitNoOp (node) {
	}

	_visitVarDecl (node) {
		const typeName = node.typeNode.value;
		const typeSymbol = this.currentScope.lookup(typeName);

		const varName = node.varNode.value;
		const varSymbol = new VarSymbol(varName, typeSymbol);

		if (this.currentScope.lookup(varName)) {
			throw new Error(`Error: Duplicate identifier '${varName}' found`);
		}

		this.currentScope.insert(varSymbol);
	}

	_visitBlock (node) {
		for (const declaration of node.declarations) {
			this.visit(declaration);
		}

		this.visit(node.compoundStatement);
	}

	_visitProgram (node) {
		const globalScope = new ScopedSymbolTable('global', 1, this.currentScope);

		globalScope.initBuiltins();
		this.currentScope = globalScope;

		this.visit(node.block);

		console.log(globalScope.toString());

		this.currentScope = this.currentScope.enclosingScope;
	}

	_visitProcedureDecl (node) {
		const procName = node.procName;
		const procSymbol = new ProcedureSymbol(procName);

		this.currentScope.insert(procSymbol);
		this.currentScope = new ScopedSymbolTable(procName, this.currentScope.scopeLevel + 1, this.currentScope);

		for (const param in node.params) {
			const paramType = this.currentScope.lookup(param.typeNode.value);
			const paramName = param.varNode.value;
			const varSymbol = new VarSymbol(paramName, paramType);

			this.currentScope.insert(varSymbol);
			procSymbol.params.push(varSymbol);
		}

		this.visit(node.blockNode);

		console.log(this.currentScope);

		this.currentScope = this.currentScope.enclosingScope;
	}

	_visitCompound (node) {
		for (const child of node.children) {
			this.visit(child);
		}
	}

	_visitVar (node) {
		const varName = node.value;
		const varSymbol = this.currentScope.lookup(varName);

		if (!varSymbol) {
			throw new Error(`Error Symbol(identifier) not found '${varName}'`);
		}
	}

	_visitAssign (node) {
		this.visit(node.right);
		this.visit(node.left);
	}

	_visitBinOp (node) {
		this.visit(node.left);
		this.visit(node.right);
	}
};
