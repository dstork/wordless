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

	const [words, setWords] = useRecoilState(wordState);

	const [colors, setColors] = useRecoilState(colorState);

	const [errorState, setErrorState] = useState(false);

	const [errorMessage, setErrorMessage] = useState("");

	const htmlDiv = useRef(null);

	const replaceLtr = (word, idx, ltr) => {
		return word.substring(0, idx) + ltr + word.substring(idx + ltr.length);
	};

	const setColorWord = (idx, colors) => {
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
		// sanity check - there cannot be more than one green letter per position
		// also, a letter that is yellow/green in one word must be yellow/green in all of them
		const greens = [".", ".", ".", ".", "."];
		let yellowLetters = "";
		let badLetters = "";
		for (let i=0; i < words.length; i++) {
			const w = words[i];
			const c = colors[i];

			for (let j=0; j < 5; j++) {
				if (c[j] === "g") {
					if (greens[j] === ".") {
						greens[j] = w[j];
					} else if (greens[j] !== w[j]) {
						// this is a problem
						setErrorState(true);
						setErrorMessage("Inconsistent input - multiple greens in the same position");
						return;
					}
				} else if (c[j] === "y") {
					if (yellowLetters.indexOf(w[j]) === -1) {
						yellowLetters += w[j];
					}
					if (badLetters.indexOf(w[j]) !== -1) {
						setErrorState(true);
						setErrorMessage(`Inconsistent input - letter ${w[j]} both gray and yellow`);
						return;
					}
				} else if (c[j] === ".") {
					// What if a letter is already green, but the second occurrence is gray? Then we can't add it to the "bad letters" list
					if (words.indexOf(w[j]) === j) {
						if (greens.indexOf(w[j]) !== -1) {
							setErrorState(true);
							setErrorMessage(`Inconsistent input - letter ${w[j]} both gray and green`);
							return;
						}
						if (yellowLetters.indexOf(w[j]) !== -1) {
							setErrorState(true);
							setErrorMessage(`Inconsistent input - letter ${w[j]} both gray and yellow`);
							return;
						}
					}
					if (badLetters.indexOf(w[j]) === -1) {
						badLetters += w[j];
					}
				}
			}
		}
		const regex = buildRegex(words, colors, badLetters, greens);

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
					setErrorMessage("No word found");
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
			} else {
				// if there are more than one word, and the last word is empty, remove it
				if (words.length > 1 && words.at(-1).length === 0) {
					setWords(words => words.slice(0, -1));
					setColors(colors => colors.slice(0, -1));
				}
			}
		}
	};

	const keyboardClickHandler = (key) => {
		const word = words.at(-1);

		if (key === "⌫") {	// BACKSPACE
			if (word.length > 0) {
				setWords(words => {
					const newWords = words.slice();
					const lastIndex = newWords.length - 1;
					newWords[lastIndex] = newWords[lastIndex].substring(0, newWords[lastIndex].length - 1);
					return newWords;
				});
			} else {
				// if there are more than one word, and the last word is empty, remove it
				if (words.length > 1 && words.at(-1).length === 0) {
					setWords(words => words.slice(0, -1));
					setColors(colors => colors.slice(0, -1));
				}
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
					{ words.at(-1).length === 5 && <div
						className="plusButton"
						onClick={() => {
							setWords(words => [...words, ""]);
							setColors(colors => [...colors, "....."]);
						}}
					>
						+
					</div> }
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
						{ errorState && errorMessage }
					</div>
					<button id="showMe" onClick={proposeWord} disabled={words.length > 5 || words.at(-1).length < 5 || errorState}>Propose word</button>
				</div>
			</footer>
		</div>
  );
}

export default App;