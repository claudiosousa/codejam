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
        static string[] words;

        static void processCase(Case cas)
        {
            cas.output = words.Where(w => Regex.Match(w, cas.input).Success).Count() + "";
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
                string[] lines = input.Trim().Split('\n');
                string[] firstLine = lines[0].Split(' ');
                int characters = Convert.ToInt32(firstLine[0]);
                int wordsNb = Convert.ToInt32(firstLine[1]);
                int nbCases = Convert.ToInt32(firstLine[2]);
                words = new string[wordsNb];
                Case[] cases = new Case[nbCases];
                for (int i = 0; i < wordsNb; i++)
                {
                    words[i] = lines[i + 1];
                }
                MatchEvaluator matchEvaluator = (MatchEvaluator)delegate(Match m)
                 {
                     return Regex.Replace(m.Value, "([a-z])(?=[a-z])", "$1|");
                 };

                for (int i = 0; i < nbCases; i++)
                {
                    var caseStr = lines[1 + wordsNb + i];
                    string res = Regex.Replace(caseStr, "\\([^\\)]*\\)", matchEvaluator);
                    cases[i] = new Case { input = res };
                }
                return cases;
            }
        }

    }

}

