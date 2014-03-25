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
        static int[,] matches;
        static char[] inputChars;
        static int getMatches(int x, int y)
        {
            int res = matches[x, y];
            if (res > -1)
                return res;
            res = 0;
            if (inputChars[x] == charsToFind[y] && y == matches.GetLongLength(1) - 1)
                res = 1;
            if (x < matches.GetLongLength(0) - 1)
            {
                res += getMatches(x + 1, y);
                if (inputChars[x] == charsToFind[y])
                    if (y < matches.GetLongLength(1) - 1)
                        res += getMatches(x + 1, y + 1);
                res = res % 10000;
            }
            matches[x, y] = res;
            return res;
        }

        static void processCase(Case cas)
        {
            inputChars = cas.input.ToArray();

            matches = new int[inputChars.Length, charsToFind.Length];

            for (int i = 0; i < matches.GetLongLength(0); i++)
                for (int j = 0; j < matches.GetLongLength(1); j++)
                    matches[i, j] = -1;

            
            int res = getMatches(0, 0);
            cas.output = (res % 10000 + "").PadLeft(4, '0');

           // Solver.printMatches();
        }

        public static void printMatches()
        {
            for (int j = 0; j < matches.GetLongLength(1); j++)
            {

                for (int i = 0; i < matches.GetLongLength(0); i++)

                    Console.Write(matches[i, j] + "\t\t");
                Console.WriteLine();
            }
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

