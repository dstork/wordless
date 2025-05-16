"""
This script prepares a frequency file for Wordle by combining a list of words with their
corresponding frequencies. The script reads a list of words from a file, and for each word,
it searches for its frequency in another file. The resulting word-frequency pairs are written
to a new file, wordle_frequency.txt.
"""
if __name__ == "__main__":
	# read all possible words for wordle
	wwords = [word.rstrip() for word in open("../../public/words.txt", encoding="utf-8").readlines()]

	# read the 100k most common words with their total occurrences
	word_frequencies = [word.rstrip() for word in open("../../public/count_1w100k.txt",
																										encoding="utf-8").readlines()]

	with open("wordle_frequency.txt", "wt", encoding="utf-8") as fd:
		for wword in wwords:
			fd.write(wword)
			for word_freq in word_frequencies:
				if word_freq.split()[0] == wword.upper():
					fd.write(f" {word_freq.split()[1]}")
					break
			fd.write("\n")