import { React } from "react";

import "./Letter.css";

function Letter({letter, idx, color, setColor, editable}) {

	// translation from color-string to CSS class
	const colorCode = {
		".": "gray",
		"y": "yellow",
		"g": "green"
	};

	const handleOnClick = () => {

		if (!editable) return;

		const toggleColor = {
			".": "y",
			"y": "g",
			"g": "."
		};

		if (!letter) return;

		setColor(toggleColor[color]);
	};

	return (
		<div 
			className={`letter ${letter ? colorCode[color] : ""}`}
			tabIndex={idx}
			onClick={handleOnClick}
		>
			{ letter }
		</div>
	)
}

export default Letter;