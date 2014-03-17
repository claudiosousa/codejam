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
            cas.output = "";
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

                long nbCases = Convert.ToInt64(lines[0]);
                long linesPerCase = (lines.Length - 1) / nbCases;

                Case[] cases = new Case[nbCases];

                for (int i = 0; i < nbCases; i++)
                {
                    var caseLine = i * linesPerCase + 1;
                    Case newcase = new Case { input = new int[linesPerCase][] };

                    for (var iLine = 0; iLine < linesPerCase; iLine++)
                    {
                        string[] lineParts = lines[caseLine + iLine].Split(' ');
                        newcase.input[iLine] = lineParts.Select(p => Convert.ToInt32(p)).ToArray();
                    }
                    cases[i] = newcase;
                }
                return cases;
            }
        }
    }

}

