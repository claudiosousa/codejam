﻿using System;
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
        static void processCase(Case cas)
        {
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
            public int[][] input;
            public string output;

            public static Case[] parseinput(string input)
            {
                string[] lines = input.Trim().Split('\n');

                int nbCases = Convert.ToInt32(lines[0]);
                Case[] cases = new Case[nbCases];

                int iLine = 1;
                for (int i = 0; i < nbCases; i++)
                {
                    int caseLines = Convert.ToInt32(lines[iLine]);
                    Case newcase = new Case { input = new int[caseLines][] };

                    for (var caseLine = 0; caseLine < caseLines; caseLine++)
                    {
                        iLine++;
                        string[] lineParts = lines[iLine].Split(' ');
                        newcase.input[caseLine] = lineParts.Select(p => Convert.ToInt32(p)).ToArray();
                    }
                    cases[i] = newcase;
                    iLine++;
                }
                return cases;
            }
        }
    }

}

