import { React, useState, useRef } from "react";

import Word from "./Word";

import buildRegex from './buildRegex';

import wf from "./tooling/wordle_frequency.txt";

import './App.css';

function App() {

	const [words, setWords] = useState([""]);

	const [colors, setColors] = useState(["....."]);

	const [badLetters, setBadLetters] = useState("");

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

	let entries = [];
	for (let i = 0; i < words.length; i++) {
		// entries.push(<Word word={words[i]} colors={colors[i]} setColors={colors => setColors(cols => cols[i] = colors)} editable={i === words.length - 1}/>);
		entries.push(<Word word={words[i]} colors={colors[i]} setColorWord={setColorWord.bind(null, i)} /*editable={i === words.length - 1}*//>);
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
				if (!greens.includes(word[i])) {
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

				setWords(words => [...words, sorted_matches[0].word]);

				setColors(colors => [...colors, colors.at(-1).replaceAll("y", ".")] );
			})
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
			}
		} else if (event.keyCode === 8) {
			if (word.length > 0) {
				setWords(words => {
					const newWords = words.slice();
					const lastIndex = newWords.length - 1;
					newWords[lastIndex] = newWords[lastIndex].substring(0, newWords[lastIndex].length - 1);
					return newWords;
				});

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

	const onValueChange = (event) => {
		setBadLetters(event.target.value);
	};

  return (
    <div className="App" onKeyUp={handleKeyUp} tabIndex={-1} ref={htmlDiv}>
      <header className="App-header" onMouseOver={handleMouseOver}>
				{ entries }
				<input id="badLetters" type="text" value={badLetters} onChange={onValueChange}/>
      </header>
			<footer>
				<div id="footerBar">
					<button id="showMe" onClick={proposeWord} disabled={words.at(-1).length < 5}>Propose word</button>
				</div>
			</footer>
    </div>
  );
}

export default App;