const Interpreter = require('./Interpreter');
const readline = require('readline');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});


(() => {
	rl.on('line', (text) => {
		let interpreter = new Interpreter(text);
		let result = interpreter.expr();

		console.log(result);
	});
})();