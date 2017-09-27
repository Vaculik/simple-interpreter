const tt = require('lexer/token/token-types');
const Token = require('lexer/token/Token');


module.exports = {
	'program': new Token(tt.PROGRAM, 'program'),
	'var': new Token(tt.VAR, 'var'),
	'DIV': new Token(tt.INTEGER_DIV, 'DIV'),
	'integer': new Token(tt.INTEGER, 'integer'),
	'real': new Token(tt.REAL, 'real'),
	'begin': new Token(tt.BEGIN, 'begin'),
	'end': new Token(tt.END, 'end'),
	'procedure': new Token(tt.PROCEDURE, 'procedure'),
};
