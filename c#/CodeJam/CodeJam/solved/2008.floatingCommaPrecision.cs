using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CodeJam
{
    static class Solver
    {
        static void processCase(Case cas)
        {
            string res = Math.Truncate(Math.Pow(3 + Math.Sqrt(5), cas.input[0][0]) % 1000)+"";
            while (res.Length < 3)
                res = "0" + res;
            cas.output = res;
        }


        public static string Solve(string input)
        {
            Case[] cases = createCases(input);
            for (int i = 0; i < cases.Length; i++)
            {
                processCase(cases[i]);
            }
            return writeOutput(cases);
        }

        static Case[] createCases(string input)
        {
            string[] lines = input.Trim().Split('\n');

            long nbCases = Convert.ToInt64(lines[0]);
            long linesPerCase = (lines.Length - 1) / nbCases;

            Case[] cases = new Case[nbCases];

            for (int i = 0; i < nbCases; i++)
            {
                var caseLine = i * linesPerCase + 1;
                Case newcase = new Case { input = new long[linesPerCase][] };

                for (var iLine = 0; iLine < linesPerCase; iLine++)
                {
                    string[] lineParts = lines[caseLine + iLine].Split(' ');
                    newcase.input[iLine] = lineParts.Select(p => Convert.ToInt64(p)).ToArray();
                }
                cases[i] = newcase;
            }
            return cases;
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
    }
}

