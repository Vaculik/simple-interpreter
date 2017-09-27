module.exports = class NodeVisitor {
	visit(node) {
		const methodName = `visit${node.constructor.name}`;
		const visitor = this[methodName] || this.genericVisit;

		return visitor(node);
	}

	genericVisit(node) {
		throw Error(`No visit${node.constructor.name} method`);
	}
};
