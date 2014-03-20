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
            var currentChar = 0;
            int width = cas.input[0].Length;
            int height = cas.input.Length;
            string[,] res = new string[height, width];
            string resStr = "\r\n";
            for (int y = 0; y < height; y++)
            {
                for (int x = 0; x < width; x++)
                {
                    string currentBassin = res[y, x];
                    if (currentBassin == null)
                    {
                        List<int[]> path = new List<int[]>();
                        int alt = cas.input[y][x];
                        path.Add(new int[] { y, x });
                        bool hasFallToNextCell = false;
                        string fallToNamedBassin = null;
                        var currentX = x;
                        var currentY = y;
                        var currettAlt = alt;
                        do
                        {
                            
                            hasFallToNextCell = false;
                            int? north = null;
                            int? west = null;
                            int? east = null;
                            int? south = null;

                            if (currentY > 0)
                                north = cas.input[currentY - 1][currentX];
                            if (currentX > 0)
                                west = cas.input[currentY][currentX - 1];
                            if (currentX < width - 1)
                                east = cas.input[currentY][currentX + 1];
                            if (currentY < height - 1)
                                south = cas.input[currentY + 1][currentX];

                            int fallToValue = int.MaxValue;

                            int[] fallToCoordinates = null;
                            if (north.HasValue && north.Value < currettAlt)
                            {
                                fallToValue = north.Value;
                                fallToCoordinates = new[] { currentY - 1, currentX };
                            }
                            if (west.HasValue && west.Value < currettAlt && west.Value < fallToValue)
                            {
                                fallToValue = west.Value;
                                fallToCoordinates = new[] { currentY, currentX - 1 };
                            }

                            if (east.HasValue && east.Value < currettAlt && east.Value < fallToValue)
                            {
                                fallToValue = east.Value;
                                fallToCoordinates = new[] { currentY, currentX + 1 };
                            }
                            if (south.HasValue && south.Value < currettAlt && south.Value < fallToValue)
                            {
                                fallToValue = south.Value;
                                fallToCoordinates = new[] { currentY + 1, currentX };
                            }

                            hasFallToNextCell = (fallToCoordinates != null);
                            if (hasFallToNextCell)
                            {
                                fallToNamedBassin = res[fallToCoordinates[0], fallToCoordinates[1]];
                                currettAlt = fallToValue;
                                currentY = fallToCoordinates[0];
                                currentX = fallToCoordinates[1];
                                if (fallToNamedBassin == null)
                                    path.Add(fallToCoordinates);
                            }

                        } while (hasFallToNextCell && fallToNamedBassin == null);
                        if (fallToNamedBassin != null)
                            currentBassin = fallToNamedBassin;
                        else
                            currentBassin = Convert.ToChar(97 + currentChar++) + "";

                        for (int i = 0; i < path.Count(); i++)
                        {
                            var coord = path[i];
                            res[coord[0], coord[1]] = currentBassin;
                        }
                    }
                    resStr += " ";
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

