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

        static bool[,] cache;

        static void calculate(int a, int b)
        {
            bool res = true;

            if (a == b || a == 0 || b == 0)
            {
                res = false;
            }
            else
            {
                int big = 0;
                int small = 0;

                if (b > a)
                {
                    big = b;
                    small = a;
                }
                else
                {
                    big = a;
                    small = b;
                }

                int moves = (int)Math.Floor((float)big / small);
                for (int i = 0; i < moves; i++)
                {
                    if (cache[small, big - (small * (i + 1))])
                    {
                        res = false;
                        break;
                    }
                }
            }

            cache[a, b] = cache[a, b] = res;
            //return res;
        }

        static void processCase(Case cas)
        {
            cache = new bool[31, 31];
            for (int i = 0; i < cache.GetLength(0); i++)
            {
                for (int j = 0; j < cache.GetLength(0); j++)
                {
                    calculate(i, j);
                }

            }
            int alwasyWins = 0;
            for (int a = cas.input[0]; a <= cas.input[1]; a++)
            {
                for (int b = cas.input[2]; b <= cas.input[3]; b++)
                {
                    if (cache[a, b])
                        alwasyWins++;
                }
            }
            cas.output = alwasyWins + "";
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

