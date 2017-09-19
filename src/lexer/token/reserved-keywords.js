const { BEGIN, END } = require('lexer/token/token-types');
const Token = require('lexer/token/Token');


module.exports = {
	[BEGIN]: new Token(BEGIN, BEGIN),
	[END]: new Token(END, END),
};
