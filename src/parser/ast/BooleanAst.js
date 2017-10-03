module.exports = class BooleanAst {
    constructor (token) {
        this.token = token;
        this.value = token.value;
    }
};
