# Wordless

Small [Wordle](https://www.nytimes.com/games/wordle/index.html) helper writen in ReactJS. 

## Setup

`$ npm install`

`$ npm start`

Access the app via the browser at http://localhost:3000.

## Usage

Enter the word(s) you entered in Wordle, then set the individual characters to gray/yellow/green with the mouse. Choose "Propose word" to get the highest-ranked proposal based on the words entered so far.
## Dataset

As input, only the list of possible Wordle solutions is used (taken from https://raw.githubusercontent.com/tabatkins/wordle-list/main/words). These entries are matched against an extract from the Google One Trillion Word Project, provided by Peter Norvig at [https://norvig.com/ngrams](https://norvig.com/ngrams/count_1w100k.txt), to determine their relative frequency (more frequent words are proposed first).

If either of these files change, you can create a new wordle_frequency.txt file by running `python3 tooling/prepare_frequency_file.py`.

## License

MIT License, see [here](LICENSE.md).