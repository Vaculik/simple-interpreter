const tt = require('lexer/token/token-types');
const Token = require('lexer/token/Token');


module.exports = {
	'PROGRAM': new Token(tt.PROGRAM, 'PROGRAM'),
	'VAR': new Token(tt.VAR, 'VAR'),
	'DIV': new Token(tt.INTEGER_DIV, 'DIV'),
	'INTEGER': new Token(tt.INTEGER, 'INTEGER'),
	'REAL': new Token(tt.REAL, 'REAL'),
	'BEGIN': new Token(tt.BEGIN, 'BEGIN'),
	'END': new Token(tt.END, 'END'),
};
