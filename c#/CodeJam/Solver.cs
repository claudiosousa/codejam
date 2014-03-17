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
            var currentChar = -1;
            int width = cas.input[0].Length;
            int height = cas.input.Length;
            string[,] res = new string[height, width];
            var resStr = "\r\n";
            for (int y = 0; y < height; y++)
            {
                for (int x = 0; x < width; x++)
                {
                    var currentBassin = res[y, x];
                    int alt = cas.input[y][x];
                    int? north = null;
                    int? west = null;
                    int? east = null;
                    int? south = null;

                    if (y > 0)
                        north = cas.input[y - 1][x];
                    if (x > 0)
                        west = cas.input[y][x - 1];
                    if (x < width - 1)
                        east = cas.input[y][x + 1];
                    if (y < height - 1)
                        south = cas.input[y + 1][x];

                    string fallTo = null;
                    int fallToValue = int.MaxValue;
                    if (north.HasValue && north.Value < alt)
                    {
                        fallTo = "north";
                        fallToValue = north.Value;
                    }
                    if (west.HasValue && west.Value < alt && west.Value < fallToValue)
                    {
                        fallTo = "west";
                        fallToValue = west.Value;
                    }

                    if (east.HasValue && east.Value < alt && east.Value < fallToValue)
                    {
                        fallTo = "east";
                        fallToValue = east.Value;
                    }
                    if (south.HasValue && south.Value < alt && south.Value < fallToValue)
                    {
                        fallTo = "south";
                        fallToValue = south.Value;
                    }
                    if (currentBassin == null)
                    {
                        currentBassin = Convert.ToChar(97 + currentChar +1 ) + "";
                    }

                    switch (fallTo)
                    {
                        case "north":
                            if (res[y - 1, x] != null)
                                currentBassin = res[y - 1, x];
                            else
                                res[y - 1, x] = currentBassin;
                            break;
                        case "west":
                            if (res[y, x - 1] != null)
                                currentBassin = res[y, x - 1];
                            else
                                res[y, x - 1] = currentBassin;
                            break;
                        case "east":
                            if (res[y, x + 1] != null)
                                currentBassin = res[y, x + 1];
                            else
                                res[y, x + 1] = currentBassin;
                            break;
                        case "south":
                            if (res[y + 1, x] != null)
                                currentBassin = res[y + 1, x];
                            else
                                res[y + 1, x] = currentBassin;
                            break;
                    }
                    resStr += " ";
                    if (currentBassin == Convert.ToChar(97 + currentChar + 1) + "")
                    {
                        currentChar++;
                    }
                    res[y, x] = currentBassin;
                    resStr += currentBassin;
                }

                resStr += "\r\n";
            }
            cas.output = resStr;
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
                Case[] cases = new Case[nbCases];
                int offSet = 1;
                for (int i = 0; i < nbCases; i++)
                {
                    int[] dimensions = lines[offSet].Split(' ').Select(d => Convert.ToInt32(d)).ToArray();
                    offSet++;
                    Case newcase = new Case { input = new int[dimensions[0]][] };

                    for (var iLine = 0; iLine < dimensions[0]; iLine++)
                    {
                        int[] rowCells = lines[offSet + iLine].Split(' ').Select(d => Convert.ToInt32(d)).ToArray();
                        newcase.input[iLine] = rowCells;
                    }
                    offSet += dimensions[0];
                    cases[i] = newcase;
                }
                return cases;
            }
        }

    }

}

