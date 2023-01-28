import { React, useState, useRef } from "react";

import Word from "./Word";

import Key from "./Key";

import buildRegex from './buildRegex';

import wf from "./tooling/wordle_frequency.txt";

import './App.css';

function App() {

	const [words, setWords] = useState([""]);

	const [colors, setColors] = useState(["....."]);

	const [badLetters, setBadLetters] = useState("");

	const [errorState, setErrorState] = useState(false);

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

	const badLetterDivs = [...badLetters].map(bl => <div className="badLetter">{bl}</div>);

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

  return (
    <div className="App" onKeyUp={handleKeyUp} tabIndex={-1} ref={htmlDiv}>
			<header id="badLetters">
					{ badLetterDivs }
			</header>
      <div className="Main" onMouseOver={handleMouseOver}>
				{ entries }
				<div id="keyboard" style={{ position: "absolute", bottom: "10vh", width: "100vw"}}>
					<div id="first_line" className="keyboard_line">
						{ ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"].map(k => <Key sKey={k}/>) }
					</div>
					<div id="second_line" className="keyboard_line">
						{ ["A", "S", "D", "F", "G", "H", "J", "K", "L"].map(k => <Key sKey={k}/>) }
					</div>
					<div id="third_line" className="keyboard_line">
						<Key sKey="ENTER" bWide={true}/>
						{ ["Z", "X", "C", "V", "B", "N", "M"].map(k => <Key sKey={k}/>) }
						<Key sKey="⌫" bWide={true}/>
					</div>
				</div>
      </div>
			<footer>
				<div id="footerBar">
					<div style={{ width: "15vh", visibility: "hidden" }}/>
					<div>
						{ errorState && "No word found" }
					</div>
					<button id="showMe" onClick={proposeWord} disabled={words.at(-1).length < 5 || errorState}>Propose word</button>
				</div>
			</footer>
    </div>
  );
}

export default App;