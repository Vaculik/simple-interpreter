const fs = require('fs');

const Lexer = require('./lexer/Lexer');
const Parser = require('./parser/Parser');
const Interpreter = require('./interpreter/Interpreter');
const SemanticAnalyzer = require('./semantic/SemanticAnalyzer');
const InputStream = require('./lexer/InputStream');


(() => {
	const fileName = process.argv[2];

	fs.readFile(fileName, 'utf8', (err, data) => {
		if (err) throw err;

		const inputStream = new InputStream(data);



		const lexer = new Lexer(inputStream);
		const parser = new Parser(lexer);
		const interpreter = new Interpreter(parser.parse());

		interpreter.evaluate();
	});
})();