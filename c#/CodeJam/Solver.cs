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
            long L = cas.input[0];
            long P = cas.input[1];
            long C = cas.input[2];
            double PoL = P / L;


            int slots = 0;
            long coveredAmount = Math.Max(1, L);
            while (coveredAmount * C < P)
            {
                coveredAmount *= C;
                slots++;
            }
            if (slots == 0)
                cas.output = "0";
            else
                cas.output = ""+ Convert.ToString(slots, 2).Length;          
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
            public int[] input;
            public string output;

            public static Case[] parseinput(string input)
            {
                string[] lines = input.Trim().Split('\n').Select(l => l.TrimEnd('\r')).ToArray();

                long nbCases = Convert.ToInt64(lines[0]);
                Case[] cases = new Case[nbCases];

                for (int i = 0; i < nbCases; i++)
                {
                    var caseLine = i + 1;
                    var lineParts = lines[caseLine].Split(' ');
                    Case newcase = new Case { input = lineParts.Select(n => Convert.ToInt32(n)).ToArray() };
                    cases[i] = newcase;
                }
                return cases;
            }
        }
    }

}

