import { React } from "react";
import { useRecoilState } from "recoil";
import wordState from "./state/wordState";
import colorState from "./state/colorState";
import badLetterState from "./state/badLetterState";
import { getAllYellows, getAllGreens } from "./util/Utils";

import "./Key.css";

function Key({sKey, bWide, style, clickHandler}) {

	const [words] = useRecoilState(wordState);
	const [colors] = useRecoilState(colorState);
	const [badLetters] = useRecoilState(badLetterState);

	const colorClass = (() => {
		const greens = getAllGreens(words, colors);
		const yellows = getAllYellows(words, colors);
		if (greens.indexOf(sKey.toLowerCase()) !== -1) {
			return "green";
		} else if (yellows.indexOf(sKey.toLowerCase()) !== -1) {
			return "yellow";
		} else if (badLetters.indexOf(sKey.toLowerCase()) !== -1) {
			return "absent";
		} else {
			return;
		}		
	})();

	const onClick = () => {
		clickHandler(sKey);
	};

	let classes = "key";
	if (bWide) {
		classes += " wide";
	}
	if (colorClass) {
		classes += ` ${colorClass}`;
	}

	return (
		<div
			className={classes}
			style={style}
			onClick={onClick}
		>
			{sKey}
		</div>
	);
}

export default Key;