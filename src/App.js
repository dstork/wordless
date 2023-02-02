import { React, useState, useRef } from "react";

import Word from "./Word";
import Keyboard from "./Keyboard";
import { useRecoilState } from "recoil";
import buildRegex from './buildRegex';
import wf from "./tooling/wordle_frequency.txt";
import wordState from "./state/wordState";
import colorState from "./state/colorState";
import badLetterState from "./state/badLetterState";
import './App.css';

function App() {

	// const [words, setWords] = useState([""]);
	const [words, setWords] = useRecoilState(wordState);

	const [colors, setColors] = useRecoilState(colorState);

	const [badLetters, setBadLetters] = useRecoilState(badLetterState);

	const [errorState, setErrorState] = useState(false);

	const htmlDiv = useRef(null);

	const replaceLtr = (word, idx, ltr) => {
		return word.substring(0, idx) + ltr + word.substring(idx + ltr.length);
	};

	const setColorWord = (idx, colors) => {
		// only the colors for the last word can be changed
		if (idx !== words.length - 1) {
			return;
		}

		setColors(cols => {
			const newCols = cols.slice();
			newCols[idx] = colors;
			return newCols;
		});
	};

	const resetErrorState = setErrorState.bind(null, false);

	const entries = [];
	for (let i = 0; i < words.length; i++) {
		entries.push(<Word word={words[i]} colors={colors[i]} setColorWord={setColorWord.bind(null, i)} resetErrorState={resetErrorState}/>);
	}

	const proposeWord = () => {
		// get all bad (gray) letters from the last word and add them to "badLetters"
		const word = words.at(-1);
		const color = colors.at(-1);

		const greens = [];
		for (let i = 0; i < 5; i++) {
			if (color[i] === "g") {
				greens.push(word[i]);
			}
		}

		let newGray = "";
		for (let i = 0; i < 5; i++) {
			if (color[i] === ".") {
				// only add it to the "bad letters" list if it's not already green -- if it is, it must be explicitly excluded from this particular index
				if (!greens.includes(word[i]) && badLetters.indexOf(word[i]) === -1 && newGray.indexOf(word[i]) === -1) {
					setBadLetters(badLetters => badLetters += word[i]);
					newGray += word[i];	
				}
			}
		}

		// since 'badLetters' is being available at the beginning of the next rendering,
		// it has to be extended here manually
		const regex = buildRegex(words, colors, badLetters + newGray);

		// filter all words satisfying this condition/regex
		fetch(wf)
			.then(data => data.text())
			.then(lines => {
				const words = lines.split("\n");
				const matches = words.filter(word => {
					const ws = word.split(" ");
					return ws[0].match(regex);
				});

				const sorted_matches = matches.map(match => {
					const split = match.split(" ");
					return {
						word: split[0],
						value: split.length > 1 ? parseInt(split[1], 10) : 1
					};	
				}).sort( (a,b) => {
					return b.value - a.value;		// sort largest first
				});

				if (sorted_matches.length === 0) {
					// no word fits the input
					setErrorState(true);
				} else {
					setWords(words => [...words, sorted_matches[0].word]);

					setColors(colors => [...colors, colors.at(-1).replaceAll("y", ".")] );
				}				
			});
	};

	const handleMouseOver = () => {
		htmlDiv.current.focus();
	};

	const handleKeyUp = (event) => {
		if (words.length > 1) {
			return;
		}

		// the key should be appended to the current word
		const isValidLetter = ltr => ltr.match(/^[a-z]$/i);
		
		const word = words.at(-1);
		if (isValidLetter(event.key)) {
			if (word.length < 5) {
				setWords(words => {
					const newWords = words.slice();
					newWords[words.length - 1] = newWords[words.length - 1] + event.key;
					return newWords;
				});
				resetErrorState();
			}
		} else if (event.keyCode === 8) {
			if (word.length > 0) {
				setWords(words => {
					const newWords = words.slice();
					const lastIndex = newWords.length - 1;
					newWords[lastIndex] = newWords[lastIndex].substring(0, newWords[lastIndex].length - 1);
					return newWords;
				});
				resetErrorState();

				// set the color of the character that was just removed to "."
				setColors(colors => {
					const newColors = colors.slice();
					const lastIndex = newColors.length - 1;
					newColors[lastIndex] = replaceLtr(newColors[lastIndex], words[lastIndex].length - 1, ".");
					return newColors;
				});
			}
		}
	};

	const keyboardClickHandler = (key) => {
		if (words.length > 1) {
			return;
		}

		const word = words.at(-1);

		if (key === "⌫") {	// BACKSPACE
			if (word.length > 0) {
				setWords(words => {
					const newWords = words.slice();
					const lastIndex = newWords.length - 1;
					newWords[lastIndex] = newWords[lastIndex].substring(0, newWords[lastIndex].length - 1);
					return newWords;
				});
			}
		} else if (key === "⏎") {	// ENTER
			if (words.at(-1).length === 5) {
				proposeWord();
			}
		} else {
			// normal key
			if (word.length < 5) {
				setWords(words => {
					const newWords = words.slice();
					newWords[words.length - 1] = newWords[words.length - 1] + key.toLowerCase();
					return newWords;
				});
			}
		}
	}

  return (
		<div className="App" onKeyUp={handleKeyUp} tabIndex={-1} ref={htmlDiv}>

			<div className="Main" onMouseOver={handleMouseOver}>
				<div style={{flex: "1", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
					{ entries }
				</div>
				<Keyboard
					style={{ flex: "0", marginBottom: "3vh", width: "96vw" }}
					clickHandler={keyboardClickHandler}
				/>
			</div>

			<footer>
				<div id="footerBar">
					<div style={{ width: "15vh", visibility: "hidden" }}/>
					<div>
						{ errorState && "No word found" }
					</div>
					<button id="showMe" onClick={proposeWord} disabled={words.length > 5 || words.at(-1).length < 5 || errorState}>Propose word</button>
				</div>
			</footer>
		</div>
  );
}

export default App;