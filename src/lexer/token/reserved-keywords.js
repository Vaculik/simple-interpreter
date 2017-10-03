const tt = require('./token-types');
const Token = require('./Token');


module.exports = {
	'if': new Token(tt.KW, 'if'),
	'then': new Token(tt.KW, 'then'),
	'else': new Token(tt.KW, 'else'),
	'integer': new Token(tt.KW, 'integer'),
	'real': new Token(tt.KW, 'real'),
	'lambda': new Token(tt.KW, 'lambda'),
	'true': new Token(tt.KW, 'true'),
	'false': new Token(tt.KW, 'false'),
};
