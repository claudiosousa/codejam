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
            int matches = 0;
            char[] inputChars = cas.input.ToArray();
            int[] foundCharsindexes = new int[charsToFind.Length];
            bool found = false;
            for (int i = 0; i < charsToFind.Length; i++)
            {
                char toFind = charsToFind[i];
                found = false;
                for (int i2 = 0; i2 < inputChars.Length; i2++)
                {
                    if (inputChars[i2] == toFind)
                    {
                        found = true;
                        foundCharsindexes[i] = i2;
                        break; ;
                    }
                }
                if (!found)
                    break;
            }

            if (found)
            {
                matches = 1;
                for (int i = charsToFind.Length - 1; i >= 0; i--)
                {
                    var charToFind = charsToFind[i];
                    var charFirstFoundAt = foundCharsindexes[i];
                    for (int i2 = charFirstFoundAt + 1; i2 < inputChars.Length; i2++)
                    {
                        if (inputChars[i2] == charToFind)
                        {

                            matches++;
                        }
                    }
                }
            }
            cas.output = (matches % 10000 + "").PadLeft(3, '0');
        }

        public static string Solve(string input)
        {
            Case[] cases = Case.parseinput(input);
            for (int i = 0; i < cases.Length; i++)
            {
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

