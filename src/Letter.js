import { React, useState, useRef } from "react";

import "./Letter.css";

function Letter({idx, setWord, setColors}) {

	const [ltr, setLtr] = useState("");

	const [bgColor, setBgColor] = useState("none");

	const htmlDiv = useRef(null);

	const replaceLtr = (word, ltr) => {
		return word.substring(0, idx) + ltr + word.substring(idx + ltr.length);
	};

	const handleKeyUp = event => {
		const isValidLetter = ltr => ltr.match(/^[a-z]$/i);
		
		if (isValidLetter(event.key)) {
			setLtr(event.key);
			setWord(word => replaceLtr(word, event.key));
			// a letter without a color does not make sense
			if (bgColor === "none") {
				setBgColor("yellow");
				setColors(colors => replaceLtr(colors, "y"));
			}
		} else if (event.keyCode === 8) {
			setLtr("");
			setWord(word => replaceLtr(word, "."));
			setBgColor("none");
			setColors(colors => replaceLtr(colors, "."));
		}
	};

	const handleHover = () => {
		htmlDiv.current.focus();
	};

	const handleOnClick = () => {

		const colorCode = {
			yellow: "y",
			green: "g"
		};

		if (!ltr) return;

		setBgColor(bgColor => bgColor === "yellow" ? "green" : "yellow");

		setColors(colors => replaceLtr(colors, colorCode[bgColor === "yellow" ? "green" : "yellow"]));
	};

	return (
		<div 
			className={`letter ${bgColor}`} 
			tabIndex={idx}
			ref={htmlDiv}
			onKeyUp={handleKeyUp}
			onMouseOver={handleHover}
			onClick={handleOnClick}
		>
			{ ltr }
		</div>
	)
}

export default Letter;