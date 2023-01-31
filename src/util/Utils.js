const _getAllChars = (words, colors, colorCode) => {
	const chars = [];
	for (let word_idx = 0; word_idx < words.length; word_idx++) {
		for (let i = 0; i < 5; i++) {
			if (colors[word_idx][i] === colorCode) {
				// if the same char exists multiple times in a word, we'll have to add it here
				if (!chars.includes(words[word_idx][i])) {
					chars.push(words[word_idx][i]);
				}
			}
		}
	}
	
	return chars;
};

const getAllYellows = (words, colors) => {
	return _getAllChars(words, colors, "y");
};

const getAllGreens = (words, colors) => {
	return _getAllChars(words, colors, "g");
};

export {
	getAllYellows,
	getAllGreens
};