using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace CodeJam
{

    class Solver
    {

        static void processCase(Case cas)
        {
            BigInteger r = cas.input[0];
            BigInteger T = cas.input[1];
            long t0 = (long)(BigInteger.Pow(r + 1, 2) - BigInteger.Pow(r, 2));


            cas.output = BigInteger.Divide(BigInteger.Add(2 - t0, Tools.Sqrt(BigInteger.Add(4 - 4 * t0, BigInteger.Add(BigInteger.Pow(t0, 2), BigInteger.Multiply(8, T))))), 4) + "";
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
            public BigInteger[] input;
            public string output;

            public static Case[] parseinput(string input)
            {
                string[] lines = input.Trim().Split('\n').Select(l => l.TrimEnd('\r')).ToArray();

                int nbCases = Convert.ToInt32(lines[0]);
                Case[] cases = new Case[nbCases];

                for (int i = 0; i < nbCases; i++)
                {
                    var caseLine = i + 1;
                    var lineParts = lines[caseLine].Split(' ');
                    Case newcase = new Case { input = lineParts.Select(n => BigInteger.Parse(n)).ToArray() };
                    cases[i] = newcase;
                }
                return cases;
            }
        }
    }

}

