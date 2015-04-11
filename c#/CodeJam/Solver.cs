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
        int currentMin;
        int calculateIfSplit(List<int> plates, int minutes)
        {
            minutes++;
            int maxPankakes = plates.Max();
            int pi = plates.IndexOf(maxPankakes);
            int half = plates[pi] / 2;
            plates[pi] -= half;
            List<int> plates2 = new List<int>(plates);
            var max = plates.Max();
            plates.Add(half);
            if (plates.Count == 2 || plates[pi] == max)
                return calculateMinutes(plates, minutes);


            plates2[plates2.IndexOf(max)] += half;
            return Math.Min(calculateMinutes(plates, minutes), calculateMinutes(plates2, minutes));
        }


        int calculateIfNoSplit(List<int> plates, int minutes)
        {
            minutes++;
            int i = 0;
            do
            {
                int p = plates[i];
                if (p == 1)
                    plates.RemoveAt(i);
                else
                {
                    plates[i]--;
                    i++;
                }
            } while (i < plates.Count);
            return calculateMinutes(plates, minutes);
        }

        int calculateMinutes(List<int> plates, int minutes)
        {
            if (minutes >= currentMin)
                return currentMin;
            if (plates.Count == 0)
            {
                currentMin = minutes;
                return minutes;
            }
            if (plates.Max() <= 3 )
                return calculateIfNoSplit(new List<int>(plates), minutes); 
            /*if (plates.Max() % 2 == 1)
                return calculateIfNoSplit(new List<int>(plates), minutes);
            */
            return Math.Min(calculateIfSplit(new List<int>(plates), minutes), calculateIfNoSplit(new List<int>(plates), minutes));
        }
        string solveCase(int[][] input)
        {
            currentMin = int.MaxValue;
            List<int> plates = new List<int>(input[1]);
            int minutes = 0;
            return calculateMinutes(plates, 0).ToString();
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

