module.exports = class NodeVisitor {
	visit(node) {
		const methodName = `visit${node.constructor.name}`;
		let visitor = this[methodName] || this.genericVisit;

		visitor = visitor.bind(this);
		return visitor(node);
	}

	genericVisit(node) {
		throw Error(`No visit${node.constructor.name} method`);
	}
};
