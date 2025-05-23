import { getAllYellows } from "./util/Utils";

function buildRegex(words, colors, badLetters, greens) {

	let regexString = "^";
	// if there are any chars in badLetters, we need a (negative) lookahead assertion
	if (badLetters.length > 0) {
		regexString += `(?=[^${badLetters.toLowerCase()}]{5})`;
	}

	// for all yellows letters, we need to ensure they're in the word somewhere
  // again, a lookahead assertion is used -- TODO: how to handle multiple matching characters?
	const yellows = getAllYellows(words, colors);
	for (const yellow of yellows) {
		regexString += `(?=.*${yellow}.*)`;
	}

	const latest_word_idx = words.length - 1;

	regexString += [0, 1, 2, 3, 4].map(idx => {
		if (greens[idx] !== ".") {
			// easist case: the character was already correct, so any word satisfying the pattern will have the same character & hence color
			return greens[idx].toLowerCase();
		} else {
			// check if it is part of bad letters, and if not, explicitly exclude it
			// if (badLetters.indexOf(words[latest_word_idx][idx]) === -1) {
			// 	return `[^${words[latest_word_idx][idx]}]`;			// what is this case for? there is already the lookahead in line 21
			// } else {
			// 	return ".";
			// }
			const column_yellows = [];
			for (let word_idx = 0; word_idx < words.length; word_idx++) {
				if (colors[word_idx][idx] === "y") {
					column_yellows.push(words[word_idx][idx].toLowerCase());
				}
			}

			if (column_yellows.length > 0) {
				// this case depends on the existence of "free" (.) fields; if there are none then
				// the solution is a permutation of the yellow fields
				if (colors[latest_word_idx].indexOf(".") !== -1) {
					return `[^${yellows.filter(y => column_yellows.includes(y)).join("")}]`;		// e.g. [^dfi]
				} else {
					// build an inclusive list of all yellow characters, except those for the current column
					return `[${yellows.filter(y => !column_yellows.includes(y)).join("")}]`;
				}
			} else {
				return ".";
			}
		}
	}).join("");

	regexString += "$";

	return new RegExp(regexString);
}

export default buildRegex;