# TODO

* ~~check if count_1w100k.txt can be used (license)~~
* ~~clean up old project files~~
* ~~adapt readme.md~~
* ~~introduce new logic~~
	* ~~always show the most common word (how to handle the case where multiple have value 1?)~~
	* ~~user confirms the best word via a "USE" button (or ENTER automatically gets the best word and enters it in the next line)~~
	* ~~word is entered into the five individual fields automatically, user can set grey/yellow/green~~
* ~~Move "show me" button down~~
* ~~"bad letters" should be like Wordle, UI-wise (individual letters, no word)~~
* ~~Need to catch keyboard events also on "App", then fill the input fields based on the input~~
* create a user monkey script that allows solving them on the Wordle page itself
* ~~allow multiple inputs (6 tries, like in the original)~~
* ~~generate a github page for the repo~~
* write tests, at least for buildRegex.js
* ~~properly handle the case, where no word is found (due to wrong input e.g.)~~
* read the word file once, not every time in the button's click handler
* add support for German and Spanish (segmented button with country flag for highlight)
* ~~allow to add multiple rows of failed entries (last resort)~~
* ~~fix the bottom bar eating the last keyboard row on iOS~~
* extend logic at some point:
 * two yellows from the same word have to be treated differently than two yellows from two different words
 * need to track which are still valid, and which are already green in later entries/words