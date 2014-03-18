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
                    int[] arraySize = lines[iLine].Split(' ').Select(s => Convert.ToInt32(s)).ToArray();

                    Case newcase = new Case { input = new int[arraySize[0]][] };

                    for (var iArrayLine = 0; iArrayLine < arraySize[0]; iArrayLine++)
                    {
                        iLine++;

                        int[] lineBitArray = new int[arraySize[1]];
                        string lineHex = lines[iLine];
                        Regex.Replace(lineHex, "5", "001";);

                        
                        int lineBitArrayOffset = 0;
                        for (int iHex = 0; iHex < lineHex.Length; iHex++)
                        {
                            string binaryLine = Convert.ToString(Convert.ToInt32("" + lineHex[iHex], 16), 2);
                            lineBitArrayOffset += 4;
                            for (int iByte = binaryLine.Length-1; iByte>=0; iByte--)
                            {
                                lineBitArray[lineBitArrayOffset - iByte] = binaryLine[binaryLine.Length - 1 - iByte];
                            }
                        }
                    }
                    cases[i] = newcase;
                    iLine++;
                }
                return cases;
            }
        }
    }

}

