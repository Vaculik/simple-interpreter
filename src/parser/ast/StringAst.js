module.exports = class StringAst {
    constructor (token) {
        this.token = token;
        this.value = token.value;
    }
};
