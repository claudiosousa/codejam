using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace CodeJam
{

    class Solver
    {
        static char[] charsToFind = "welcome to code jam".ToArray();

        static void processCase(Case cas)
        {
            char[] inputChars = cas.input.ToArray();
            List<int>[] foundCharsindexes = new List<int>[charsToFind.Length];
            for (int i = 0; i < charsToFind.Length; i++)
            {
                char toFind = charsToFind[i];
                List<int> foundCharPos = new List<int>();
                int start = i > 0 ? foundCharsindexes[i - 1][0] + 1 : i;
                int end = inputChars.Length - charsToFind.Length + i + 1;
                for (int i2 = start; i2 < end; i2++)
                {
                    if (inputChars[i2] == toFind)
                    {
                        foundCharPos.Add(i2);
                    }
                }
                if (foundCharPos.Count == 0)
                {
                    cas.output = "0000";
                    return;
                }

                foundCharsindexes[i] = foundCharPos;
            }
            int matches = 1;
            int[] charPosIndex = new int[charsToFind.Length];
            for (int i = 0; i < charsToFind.Length; i++)
            {
                charPosIndex[i] = 0;
            }


            var found1match = false;
            do
            {
                found1match = false;
                for (int i = charsToFind.Length - 1; i >= 0; i--)
                {
                    int iCurrentPosIndex = charPosIndex[i];
                    List<int> charPositions = foundCharsindexes[i];
                    while (iCurrentPosIndex < charPositions.Count - 1)
                    {
                        bool i2charposfound = true;
                        iCurrentPosIndex += 1;
                        charPosIndex[i] = iCurrentPosIndex;
                        var nextPos = charPositions[iCurrentPosIndex];
                        var currentCharPos = nextPos;
                        for (int i2 = i + 1; i2 < charsToFind.Length; i2++)
                        {
                            i2charposfound = false;
                            List<int> char2Positions = foundCharsindexes[i2];
                            for (int i3 = 0; i3 < char2Positions.Count; i3++)
                            {
                                int charPos = char2Positions[i3];
                                if (charPos > currentCharPos)
                                {
                                    charPosIndex[i2] = i3;
                                    currentCharPos = charPos;
                                    i2charposfound = true;
                                    break;
                                }
                            }
                            if (!i2charposfound)
                                break;
                        }
                        if (i2charposfound)
                        {
                            found1match = true;
                        }
                        break;

                    }
                    if (found1match)
                        break;
                }
                if (found1match)
                {
                    /*
                    var currentMatch = cas.input.ToArray();
                    for (int i = 0; i < charPosIndex.Length; i++)
                    {
                        int pos = foundCharsindexes[i][charPosIndex[i]];
                        currentMatch[pos] = '_';
                    }
                    Console.WriteLine(new string(currentMatch));
                     */
                    matches++;
                }
            } while (found1match);

            cas.output = (matches % 10000 + "").PadLeft(4, '0');
        }

        public static string Solve(string input)
        {
            Case[] cases = Case.parseinput(input);
            for (int i = 0; i < cases.Length; i++)
            {
                Console.WriteLine("Case: " + i);
                processCase(cases[i]);
            }
            return writeOutput(cases);
        }

        static string writeOutput(Case[] cases)
        {
            var sb = new StringBuilder();
            for (var i = 0; i < cases.Length; i++)
            {
                sb.AppendLine("Case #" + (i + 1) + ": " + cases[i].output);

            }
            return sb.ToString(); ;
        }

        class Case
        {
            public string input;
            public string output;

            public static Case[] parseinput(string input)
            {
                string[] lines = input.Trim().Split('\n').Select(l => l.TrimEnd('\r')).ToArray();

                long nbCases = Convert.ToInt64(lines[0]);
                long linesPerCase = (lines.Length - 1) / nbCases;

                Case[] cases = new Case[nbCases];

                for (int i = 0; i < nbCases; i++)
                {
                    var caseLine = i * linesPerCase + 1;
                    Case newcase = new Case { input = lines[caseLine] };
                    cases[i] = newcase;
                }
                return cases;
            }
        }
    }

}

