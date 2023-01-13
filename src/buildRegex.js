function buildRegex(word, colors, badLetters) {
	const getAllOtherYellows = (word, idx) => {
		const yellows = [];
		for (let i = 0; i < 5; i++) {
			if (i === idx) continue;
			if (colors[i] === "y") {
				yellows.push(word[i]);
			}
		}
		return yellows;
	};

	let regexString = "^"
	// if there are any chars in badLetters, we need a (negative) lookahead assertion
	if (badLetters.length > 0) {
		regexString += `(?=[^${badLetters.toLowerCase()}]{5})`;
	}

	// for all yellows letters, we need to ensure they're in the word somewhere
  // again, a lookahead assertion is used
	const yellows = getAllOtherYellows(word, -1);
	for (const yellow of yellows) {
		regexString += `(?=.*${yellow}.*)`;
	}

	regexString += [0, 1, 2, 3, 4].map(idx => {
		if (colors[idx] === "g") {
			return word[idx];
		} else if (colors[idx] === "y") {
			// this case depends on the existence of "free" (.) fields; if there are none then
			// the solution is a permutation of the yellow fields
			if (word.indexOf(".") !== -1) {
				return `[^${word[idx]}]`;
			} else {
				// build an inclusive list of all yellow characters, except the current
				const yellows = getAllOtherYellows(word, idx);
				return `[${yellows}]`;
			} 
		} else {
			return ".";
		}
	}).join("");

	regexString += "$";

	return new RegExp(regexString);
}

export default buildRegex;