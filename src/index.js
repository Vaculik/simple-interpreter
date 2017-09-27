const readline = require('readline');
const fs = require('fs');

const Lexer = require('lexer/Lexer');
const Parser = require('parser/Parser');
const Interpreter = require('interpreter/Interpreter');


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
		const interpreter = new Interpreter(parser);
		const result = interpreter.interpret();
	});
})();