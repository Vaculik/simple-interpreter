const readline = require('readline');

const Lexer = require('lexer/Lexer');
const Parser = require('parser/Parser');
const Interpreter = require('interpreter/Interpreter');


const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

(() => {
	rl.on('line', (text) => {
		const lexer = new Lexer(text);
		const parser = new Parser(lexer);
		const interpreter = new Interpreter(parser);
		const result = interpreter.interpret();

		console.log(result);
	});
})();