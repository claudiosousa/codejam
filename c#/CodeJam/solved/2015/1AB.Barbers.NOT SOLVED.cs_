using CodeJam.algos;
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
        struct barber
        {
            public int i;
            public int time;
            public ulong Next;
        }

        string solveCase(int[][] input)
        {
            int n = input[0][1];

            List<barber> barbers = new List<barber>(input.Length);
            int[] barbersTimes = input[1];
            for (int i = 0; i < barbersTimes.Length; i++)
            {
                int t = barbersTimes[i];
                barbers.Add(new barber { i = i + 1, time = t });
            }
            barbers.Sort((a, b) => a.Next > b.Next ? 1 : (a.Next < b.Next ? -1 : (a.i < b.i ? -1 : 1)));


            // barber b;
            int afteri = 0;
            for (int i = 0; i < n; i++)
            {
                barber b = barbers[0];
                if (i==n-1)
                    return b.i.ToString();
                b.Next += (ulong)b.time;              
                barbers.RemoveAt(0);
                afteri = barbers.FindLastMatchingFromBeginning((x) => x.Next < b.Next || (x.Next == b.Next && x.i < b.i));
                barbers.Insert(afteri + 1, b);
                // BinarySearch. barbers.BinarySearch
            }
            return "0";
        }


        public string Solve(string input)
        {
            string[] lines = input.Trim().Split('\n').Select(l => l.TrimEnd('\r')).ToArray();

            StringBuilder sb = new StringBuilder();
            int nbCases = Convert.ToInt32(lines[0]);
            int iLine = 1;
            for (int i = 0; i < nbCases; i++)
            {
                //Console.WriteLine("Case: " + i);

                string[] lineParts = lines[iLine].Split(' ');
                int[] linePartsint = lineParts.Select(p => Convert.ToInt32(p)).ToArray();

                int caseLines = 1;
                int[][] caseInput = new int[caseLines + 1][];
                caseInput[0] = linePartsint;

                for (var caseLine = 0; caseLine < caseLines; caseLine++)
                {
                    iLine++;
                    lineParts = lines[iLine].Split(' ');
                    linePartsint = lineParts.Select(p => Convert.ToInt32(p)).ToArray();
                    caseInput[caseLine + 1] = linePartsint;
                }
                string result = solveCase(caseInput);
                sb.AppendLine("Case #" + (i + 1) + ": " + result);
                iLine++;
            }
            return sb.ToString();
        }
    }

}

