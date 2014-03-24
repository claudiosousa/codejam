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
        static int[,] calculated;
        static int[][] curerentInput;
        static int[,] compareINdexes = new int[,] { { 0, -1 }, { 0, 1 }, { 1, 0 }, { -1, 0 } };

        static bool canLoan(int x, int y, int fromDirection, out int height)
        {
            var calculatedHeight = calculated[x, y];
            if (calculatedHeight != 0)
            {
                height = calculatedHeight;
                return true;
            }
            var cewllHeight = curerentInput[y][x];
            if (x == 0 || y == 0 || x == calculated.GetLength(0)-1 || y == calculated.GetLength(1)-1)
            {
                height = cewllHeight;
                calculated[x, y] = cewllHeight;
                return true;
            }
            int nextCellheight = 0;
            for (int i = 0; i < compareINdexes.GetLength(0); i++)
            {
                if (fromDirection == 1 && i == 0 || fromDirection == 0 && i == 1 ||
                    fromDirection == 3 && i == 2 || fromDirection == 2 && i == 3)
                    continue;

                if (!canLoan(x + compareINdexes[i, 0], y + compareINdexes[i, 1], i, out nextCellheight))
                {
                    height = 0;
                    return false;
                }
                if (nextCellheight <= cewllHeight)
                {
                    calculated[x, y] = cewllHeight;
                    height = cewllHeight;
                    return true;
                }
            }
            height = 0;
            return false;
        }
        static void processCase(Case cas)
        {
            int n = cas.input[0][0];
            int m = cas.input[0][1];
            curerentInput = cas.input.Skip(1).ToArray();
            calculated = new int[m, n];
            int cellHeight = 0;
            for (int y = 0; y < n; y++)
            {
                for (int x = 0; x < m; x++)
                {
                    if (!canLoan(x, y,-1,  out cellHeight))
                    {
                        cas.output = "NO";
                        return;
                    }
                }
            }
            cas.output = "YES";
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
                    string[] lineParts = lines[iLine].Split(' ');
                    int[] linePartsint = lineParts.Select(p => Convert.ToInt32(p)).ToArray();

                    int caseLines = linePartsint[0];
                    Case newcase = new Case { input = new int[caseLines + 1][] };
                    newcase.input[0] = linePartsint;

                    for (var caseLine = 0; caseLine < caseLines; caseLine++)
                    {
                        iLine++;
                        lineParts = lines[iLine].Split(' ');
                        linePartsint = lineParts.Select(p => Convert.ToInt32(p)).ToArray();
                        newcase.input[caseLine + 1] = linePartsint;
                    }
                    cases[i] = newcase;
                    iLine++;
                }
                return cases;
            }
        }
    }

}

