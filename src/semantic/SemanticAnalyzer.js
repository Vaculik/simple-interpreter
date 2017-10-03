const NodeVisitor = require('../interpreter/NodeVisitor');
const ScopedSymbolTable = require('../symbol/ScopedSymbolTable');
const VariableSymbol = require('../symbol/symbol-nodes/VariableSymbol');
const LambdaSymbol = require('../symbol/symbol-nodes/LambdaSymbol');


module.exports = class SemanticAnalyzer extends NodeVisitor {
	constructor () {
		super();

		this.currentEnv = null;

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
		const typeSymbol = this.currentEnv.lookup(typeName);

		const varName = node.varNode.value;
		const varSymbol = new VariableSymbol(varName, typeSymbol);

		if (this.currentEnv.lookup(varName)) {
			throw new Error(`Error: Duplicate identifier '${varName}' found`);
		}

		this.currentEnv.insert(varSymbol);
	}

	_visitBlock (node) {
		for (const declaration of node.declarations) {
			this.visit(declaration);
		}

		this.visit(node.compoundStatement);
	}

	_visitProgram (node) {
		const globalScope = new ScopedSymbolTable('global', 1, this.currentEnv);

		globalScope.initBuiltins();
		this.currentEnv = globalScope;

		this.visit(node.block);

		console.log(globalScope.toString());

		this.currentEnv = this.currentEnv.enclosingScope;
	}

	_visitProcedureDecl (node) {
		const procName = node.procName;
		const procSymbol = new LambdaSymbol(procName);

		this.currentEnv.insert(procSymbol);
		this.currentEnv = new ScopedSymbolTable(procName, this.currentEnv.scopeLevel + 1, this.currentEnv);

		for (const param in node.params) {
			const paramType = this.currentEnv.lookup(param.typeNode.value);
			const paramName = param.varNode.value;
			const varSymbol = new VariableSymbol(paramName, paramType);

			this.currentEnv.insert(varSymbol);
			procSymbol.params.push(varSymbol);
		}

		this.visit(node.blockNode);

		console.log(this.currentEnv);

		this.currentEnv = this.currentEnv.enclosingScope;
	}

	_visitCompound (node) {
		for (const child of node.children) {
			this.visit(child);
		}
	}

	_visitVar (node) {
		const varName = node.value;
		const varSymbol = this.currentEnv.lookup(varName);

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
