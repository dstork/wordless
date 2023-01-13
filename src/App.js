import { React, useState } from "react";

import Letter from './Letter';

import buildRegex from './buildRegex';

import wf from "./tooling/wordle_frequency.txt";

import './App.css';

function App() {

	const [word, setWord] = useState(".....");

	const [colors, setColors] = useState(".....");

	const [badLetters, setBadLetters] = useState("");

	const [matches, setMatches] = useState("");

	const letters = [0,1,2,3,4].map( idx => (
		<Letter idx={idx} setWord={setWord} setColors={setColors}/>
	));

	const showWords = () => {
		const regex = buildRegex(word.toLowerCase(), colors, badLetters);

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

				// display the possible words somewhere
				setMatches(sorted_matches.map(sm => {
					return `${sm.word} (${sm.value})`;
				}).join(", "));
			})
	};

	const onValueChange = (event) => {
		setBadLetters(event.target.value);
	};

  return (
    <div className="App">
      <header className="App-header">
				<div className="word">
					{ letters }
				</div>
				<button id="showMe" onClick={showWords}>Show me</button>				
				<input id="badLetters" type="text" value={badLetters} onChange={onValueChange}/>
				<textarea rows="4" cols="80" value={matches} readOnly={true}/>
      </header>
    </div>
  );
}

export default App;