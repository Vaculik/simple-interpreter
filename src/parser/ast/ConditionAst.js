module.exports = class ConditionAst {
    constructor (condition, thenBody, elseBody = null) {
        this.condition = condition;
        this.thenBody = thenBody;
        this.elseBody = elseBody;
    }
};