if __name__ == "__main__":
	# read all possible words for wordle
	wwords = [word.rstrip() for word in open("../../public/words.txt").readlines()]

	# read the 100k most common words with their total occurrences
	word_frequencies = [word.rstrip() for word in open("../../public/count_1w100k.txt").readlines()]

	with open("wordle_frequency.txt", "wt") as fd:
		for wword in wwords:
			fd.write(wword)
			for word_freq in word_frequencies:
				if word_freq.split()[0] == wword.upper():
					fd.write(f" {word_freq.split()[1]}")
					break
			fd.write("\n")