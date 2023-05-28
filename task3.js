const readline = require("readline");
const crypto = require("crypto");
const generateRandomKey = () => {
	const length = 32;
	return crypto.randomBytes(length).toString("hex");
};

const generateHMAC = (key, computerMove) => {
	const hmac = crypto.createHmac("sha256", key);
	hmac.update(String(computerMove));
	return hmac.digest("hex");
};

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const choices = process.argv.slice(2);

function generateMovesTable(choices) {
	const table = [];
	const tableRow = ["PC Moves", ...choices];

	if (choices.length !== 3) {
		table.push(tableRow);

		for (let j = 0; j < choices.length; j++) {
			const currentChoice = choices[j];
			const tableRow = [currentChoice];

			for (let i = 0; i < choices.length; i++) {
				if (i === j) {
					tableRow.push("Draw");
				} else if (
					(i - j + choices.length) % choices.length <=
					choices.length / 2
				) {
					tableRow.push("Win");
				} else {
					tableRow.push("Lose");
				}
			}

			table.push(tableRow);
		}
	} else {
		table.push(tableRow);

		for (let j = 0; j < choices.length; j++) {
			const currentChoice = choices[j];
			const tableRow = [currentChoice];

			for (let i = 0; i < choices.length; i++) {
				if (i === j) {
					tableRow.push("Draw");
				} else if (
					(i - j + choices.length) % choices.length <=
					choices.length / 2
				) {
					tableRow.push("Lose");
				} else {
					tableRow.push("Win");
				}
			}

			table.push(tableRow);
		}
	}

	return table;
}

function getWinner(userChoice, computerChoice, movesTable) {
	const result = movesTable[userChoice][computerChoice + 1];
	console.log(`You ${result}!`);
}

function validateChoices(choices) {
	if (choices.length % 2 === 0 || choices.length < 3) {
		throw new Error(
			"Please provide an odd number of non-repeating strings, with a minimum of 3 options."
		);
	}

	const lowercasedChoices = choices.map((choice) => choice.toLowerCase());
	const uniqueChoices = new Set(lowercasedChoices);

	if (uniqueChoices.size !== choices.length) {
		throw new Error("Please ensure that all options are unique.");
	}
}

function generateComputerChoice(choices) {
	return Math.floor(Math.random() * choices.length);
}

function printHMAC(hmac) {
	console.log("HMAC:", hmac);
}

function printAvailableMoves(choices) {
	console.log("Available moves:");
	choices.forEach((value, index) => console.log(`${index + 1} - ${value}`));
	console.log("0 - exit");
	console.log("? - help");
}

function processUserInput(choices, computerChoice, movesTable, userInput, key) {
	if (userInput === "0") {
		console.log("Exiting the program...");
		rl.close();
	} else if (userInput === "?") {
		console.log("Moves Table:");
		console.table(movesTable);
		rl.close();
	} else {
		const userChoice = parseInt(userInput);
		if (userChoice >= 1 && userChoice <= choices.length) {
			console.log(`User's choice: ${choices[userChoice - 1]}`);
			console.log(`Computer's choice: ${choices[computerChoice]}`);
			getWinner(userChoice, computerChoice, movesTable);
			console.log("HMAC key:", key);
		} else {
			console.log("Invalid input. Please try again.");
		}
		rl.close();
	}
}

try {
	validateChoices(choices);
	const computerChoice = generateComputerChoice(choices);
	const key = generateRandomKey();
	const hmac = generateHMAC(key, computerChoice);

	printHMAC(hmac);
	printAvailableMoves(choices);

	const movesTable = generateMovesTable(choices);
	rl.question("Enter a value: ", (answer) => {
		processUserInput(choices, computerChoice, movesTable, answer, key);
	});
} catch (error) {
	console.log("Error:", error.message);
	rl.close();
}
