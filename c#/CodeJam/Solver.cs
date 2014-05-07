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

        int maxNumbers = (int)Math.Pow(10,9);
        int[,] res;
        void intialize()
        {
            res = new int[maxNumbers, maxNumbers];
            for (int i = 0; i < maxNumbers; i++)
            {
                for (int j = 0; j < maxNumbers; j++)
                {
                    int and = i & j;
                    res[i, j] = and;
                }
            }
        }
        string solveCase(int[] input)
        {
            var a = input[0];
            var b = input[1];
            var k = input[2];
            var res = 0;// k * b + k * Math.Max(0, (a - k));
            //BigInteger res = new BigInteger();
            for (int i = 0; i < a; i++)
            {
                for (int j = 0; j < b; j++)
                {
                    if ((i & j) < k)
                        res++;
                }
            }
            return res + "";
        }


        public string Solve(string input)
        {
            //intialize();
            string[] lines = input.Trim().Split('\n').Select(l => l.TrimEnd('\r')).ToArray();

            int nbCases = Convert.ToInt32(lines[0]);
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < nbCases; i++)
            {
                //Console.WriteLine("Case: " + i);
                int caseLine = i + 1;
                string[] lineParts = lines[caseLine].Split(' ');
                int[] inputData = lineParts.Select(n => Convert.ToInt32(n)).ToArray();
                string result = solveCase(inputData);
                sb.AppendLine("Case #" + (i + 1) + ": " + result);
            }
            return sb.ToString();
        }
    }

}

