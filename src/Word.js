import { React } from "react";

import Letter from "./Letter";

import "./Word.css";

function Word({word, colors, setColorWord, resetErrorState}) {

	const replaceLtr = (word, idx, ltr) => {
		return word.substring(0, idx) + ltr + word.substring(idx + ltr.length);
	};

	const setColor = (/* letter index */ idx, color) => {
		const newColorLine = replaceLtr(colors, idx, color);
		setColorWord(newColorLine);
		resetErrorState();
	}

	const letters = [0, 1, 2, 3, 4].map(idx => {
		return <Letter letter={idx < word.length ? word[idx] : undefined} idx={idx} key={idx} color={colors[idx]} setColor={setColor.bind(null, idx)} editable={idx < word.length}/>;
	});

	return (
		<div className="word">
			{ letters }
		</div>
	);
}

export default Word;