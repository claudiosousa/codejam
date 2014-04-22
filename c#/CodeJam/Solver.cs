using System;
using System.Collections.Generic;
using System.Dynamic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace CodeJam
{

    class Solver
    {
        HashSet<string> words;
        Dictionary<string, int> sentenceReplacements;
        Dictionary<string, string> sentenceReplacementsWords;
        Dictionary<string, int[]> wordReplacements = new Dictionary<string, int[]>();
        Dictionary<string, string> wordReplacementsWord = new Dictionary<string, string>();
        int maxWordLength = 0;

        int isWordPresent(string word, int canReplaceFromIndex, out int replacedIndex, out string wordFound)
        {
            if (words.Contains(word))
            {
                wordFound = word;
                replacedIndex = -1;
                return 0;
            }
            if (wordReplacements.ContainsKey(word + canReplaceFromIndex))
            {
                wordFound = wordReplacementsWord[word + canReplaceFromIndex];
                var wordReplacement = wordReplacements[word + canReplaceFromIndex];
                replacedIndex = wordReplacement[1];
                return wordReplacement[0];
            }
            List<int> replacements = new List<int>();
            do
            {
                char[] wordArray = word.ToCharArray();

                if (replacements.Count == 0)
                {
                    if (canReplaceFromIndex >= wordArray.Length)
                        break;
                    replacements.Add(canReplaceFromIndex);
                }
                else
                {
                    int charCanGoUpTo = wordArray.Length - 1;
                    bool movedNext = false;
                    for (int i = replacements.Count - 1; i >= 0; i--)
                    {
                        int replacement = replacements[i];
                        if (replacement < charCanGoUpTo)
                        {
                            replacement++;
                            replacements[i] = replacement;
                            movedNext = true;
                            int nextChar = replacement + 5;
                            for (int j = i; j < replacements.Count - 1; j++)
                            {
                                replacements[i] = nextChar;
                                nextChar += 5;
                            }
                            break;
                        }
                        charCanGoUpTo = replacement - 5;
                    }
                    if (!movedNext)
                        break;
                }
                for (int i = 0; i < replacements.Count; i++)
                {
                    wordArray[replacements[i]] = '_';
                }
                if (words.Contains(new String(wordArray)))
                {
                    replacedIndex = replacements[replacements.Count - 1];
                    wordReplacements.Add(word + canReplaceFromIndex, new int[] { replacements.Count, replacedIndex });
                    wordFound = new String(wordArray);
                    wordReplacementsWord.Add(word + canReplaceFromIndex, wordFound);
                    return replacements.Count;
                }
            } while (true);
            replacedIndex = -1;
            wordReplacements.Add(word + canReplaceFromIndex, new int[] { -1, -1 });
            wordFound = "";
            wordReplacementsWord.Add(word + canReplaceFromIndex, wordFound);
            return -1;
        }
        int getReplacementsCount(string input, int canReplaceFromIndex, out string minReplacementWord)
        {
            minReplacementWord = "";
            if (input.Length == 0)
                return 0;
            if (sentenceReplacements.ContainsKey(input + canReplaceFromIndex))
            {
                minReplacementWord = sentenceReplacementsWords[input + canReplaceFromIndex];
                return sentenceReplacements[input + canReplaceFromIndex];
            }
            if (words.Contains(input))
            {
                sentenceReplacements.Add(input + canReplaceFromIndex, 0);
                sentenceReplacementsWords.Add(input + canReplaceFromIndex, input);
                minReplacementWord = input;
                return 0;
            }
            int maxWordSize = Math.Min(input.Length, maxWordLength);
            int minReplacements = -1;
            for (int i = 0; i < maxWordSize; i++)
            {
                string word1 = input.Substring(0, i + 1);
                string word1Found;
                int replacedIndex;
                int word1Replacements = isWordPresent(word1, canReplaceFromIndex, out replacedIndex, out word1Found);

                if (word1Replacements == -1)
                    continue;
                if (minReplacements >= 0 && word1Replacements > minReplacements)
                    continue;
                int nextWordsReplacements = 0;
                string nextWordsReplacementsWords = "";
                
                if (i < input.Length - 1)
                {
                    int canReplacenextWordsFromIndex = Math.Max(0,Math.Max(canReplaceFromIndex - i - 1, replacedIndex == -1 ? 0 : 4-(i-replacedIndex) ));
                    nextWordsReplacements = getReplacementsCount(input.Substring(i + 1), canReplacenextWordsFromIndex, out nextWordsReplacementsWords);
                    if (nextWordsReplacements == -1)
                        continue;
                }
                if (minReplacements == -1 || word1Replacements + nextWordsReplacements < minReplacements)
                {
                    minReplacements = word1Replacements + nextWordsReplacements;
                    minReplacementWord = word1Found + " " + nextWordsReplacementsWords;
                }
            }
            sentenceReplacementsWords.Add(input + canReplaceFromIndex, minReplacementWord);
            sentenceReplacements.Add(input + canReplaceFromIndex, minReplacements);
            return minReplacements;
        }

        string solveCase(string input)
        {
            sentenceReplacements = new Dictionary<string, int>();
            sentenceReplacementsWords = new Dictionary<string, string>();
            string replacementWords;
            var replacementsCount = getReplacementsCount(input, 0, out replacementWords);
            return replacementsCount + "";// ": " + replacementWords;
        }

        void add2words(string key, string value)
        {
            if (!words.Contains(key))
                words.Add(key);
        }
        public void Initialize()
        {

            string[] dict = File.ReadAllLines("garbled_email_dictionary.txt");
            words = new HashSet<string>();

            for (int i = 0; i < dict.Length; i++)
            {
                string word = dict[i];
                words.Add(word);
                char[] tempWord = word.ToCharArray();
                int wordLength = word.Length;
                if (wordLength > maxWordLength)
                    maxWordLength = wordLength;
                tempWord[0] = '_';
                add2words(new String(tempWord), word);
                int currentReplaceIndex = 0;
                List<int> replacedCharsIndexes = new List<int>();
                do
                {
                    if (currentReplaceIndex + 5 < wordLength)
                    {
                        replacedCharsIndexes.Add(currentReplaceIndex);
                        currentReplaceIndex += 5;
                        tempWord[currentReplaceIndex] = '_';
                    }
                    else if (currentReplaceIndex < wordLength - 1)
                    {
                        tempWord[currentReplaceIndex] = word[currentReplaceIndex];
                        currentReplaceIndex++;
                        tempWord[currentReplaceIndex] = '_';
                    }
                    else if (replacedCharsIndexes.Count > 0)
                    {
                        currentReplaceIndex = replacedCharsIndexes.Last();
                        replacedCharsIndexes.RemoveAt(replacedCharsIndexes.Count - 1);
                        currentReplaceIndex++;
                        if (currentReplaceIndex < wordLength - 1)
                        {
                            tempWord[currentReplaceIndex - 1] = word[currentReplaceIndex - 1];
                            tempWord[currentReplaceIndex] = '_';
                        }
                        else
                            continue;
                    }
                    else
                        break;
                    add2words(new String(tempWord), word);
                } while (true);
            }

        }

        public string Solve(string input)
        {
            string[] lines = input.Trim().Split('\n').Select(l => l.TrimEnd('\r')).ToArray();

            int nbCases = Convert.ToInt32(lines[0]);
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < nbCases; i++)
            {
                //Console.WriteLine("Case: " + i);
                int caseLine = i + 1;
                string line = lines[caseLine];
                string result = solveCase(line);
                sb.AppendLine("Case #" + (i + 1) + ": " + result);
            }
            return sb.ToString();
        }
    }

}

