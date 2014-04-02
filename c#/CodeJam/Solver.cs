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

        static void processCase(Case cas)
        {
            int n = cas.input[0];
            int x = Math.Abs(cas.input[1]);
            int y = Math.Abs(cas.input[2]);

            if ((x + y) == 0)
            {
                cas.output = "1.0";
                return;
            }

            if ((x + y) % 2 == 1)
            {
                cas.output = "0.0";
                return;
            }
            int piramideSide = (int)Math.Sqrt(n * 2);
            if (piramideSide % 2 == 0)
                piramideSide--;
            while ((piramideSide * piramideSide + 1) / 2 > n)
                piramideSide -= 2;

            if ((x + y) < piramideSide - 1)
            {
                cas.output = "1.0";
                return;
            }

            int nonPiramideN = n - (piramideSide * (piramideSide + 1)) / 2;

            if ((x + y) > piramideSide + 1
                || y + 1 > nonPiramideN ||
                y > piramideSide)
            {
                cas.output = "0.0";
                return;
            }

            if (nonPiramideN - piramideSide > (y + 1))
            {
                cas.output = "1.0";
                return;
            }

            int halfOdds = y + 1;
            if (nonPiramideN == halfOdds)
                cas.output = "0.5";
            else if (nonPiramideN > halfOdds)
                cas.output = (1 - Math.Pow(.5, nonPiramideN - halfOdds + 1)) + "";
            else
                cas.output = Math.Pow(.5, halfOdds - nonPiramideN + 1) + "";
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

