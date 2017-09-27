const readline = require('readline');
const fs = require('fs');

const Lexer = require('lexer/Lexer');
const Parser = require('parser/Parser');
const Interpreter = require('interpreter/Interpreter');
const SemanticAnalyzer = require('semantic/SemanticAnalyzer');


const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

(() => {
	const fileName = process.argv[2];

	fs.readFile(fileName, 'utf8', (err, data) => {
		if (err) throw err;

		const lexer = new Lexer(data);
		const parser = new Parser(lexer);
		const astTree = parser.parse();

		const semanticAnalyzer = new SemanticAnalyzer();

		try {
			semanticAnalyzer.visit(astTree);
		} catch (err) {
			console.log(err);
		}

		const interpreter = new Interpreter(astTree);
		interpreter.interpret();

		console.log(interpreter.globalMemory);
	});
})();