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

        static void getValidRes(int fullPiramideSide, int leftFromPiramide, int Y, int r, int l, ref int runs, ref int validruns)
        {
            if (leftFromPiramide == 0)
            {
                runs += 1;
                if (l > Y)
                    validruns++;
                return;
            }
            if (r < fullPiramideSide + 1)
            {
                getValidRes(fullPiramideSide, leftFromPiramide - 1, Y, r + 1, l, ref runs, ref validruns);
            }

            if (l < fullPiramideSide + 1)
            {
                getValidRes(fullPiramideSide, leftFromPiramide - 1, Y, r, l + 1, ref runs, ref validruns);
            }
        }

        static string solveCase(int[] input)
        {
            int N = input[0];
            int X = Math.Abs(input[1]);
            int Y = input[2];
            int xplusy = X + Y;
            int fullPiramideSide = (int)Math.Sqrt(N * 2) + 2;
            if (fullPiramideSide % 2 == 0)
                fullPiramideSide -= 1;
            while ((fullPiramideSide * (fullPiramideSide + 1)) / 2 > N)
                fullPiramideSide -= 2;

            if (xplusy < fullPiramideSide)
                return "1";
            if (xplusy > fullPiramideSide + 1)
                return "0";
            if (xplusy >= fullPiramideSide && X == 0)
                return "0";
            int leftFromPiramide = N - (fullPiramideSide * (fullPiramideSide + 1)) / 2;
            if (leftFromPiramide < Y)
                return "0";
            if (leftFromPiramide > fullPiramideSide + 1 + Y)
                return "1";
            if (leftFromPiramide == 0)
                return "0";
            /*
            double res = 0;
            for (int i = 0; i < leftFromPiramide - Y; i++)
            {
                res += (double)1 / 2 / Math.Pow(2, i + Math.Pow(Y,2));
            }
            */
            int runs = 0;
            int validruns = 0;
            getValidRes(fullPiramideSide, leftFromPiramide, Y, 0, 0, ref runs, ref validruns);
            return ((double)validruns / runs).ToString();
        }


        public static string Solve(string input)
        {
            string[] lines = input.Trim().Split('\n').Select(l => l.TrimEnd('\r')).ToArray();

            int nbCases = Convert.ToInt32(lines[0]);
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < nbCases; i++)
            {
                Console.WriteLine("Case: " + i);
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

