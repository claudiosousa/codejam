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
        string solveCase(string input)
        {
            var res = input.Split(' ').Reverse();
            return res.Aggregate((a, b) => a + " " + b);
        }


        public string Solve(string input)
        {
            string[] lines = input.Trim().Split('\n').Select(l => l.TrimEnd('\r')).ToArray();

            int nbCases = Convert.ToInt32(lines[0]);
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < nbCases; i++)
            {
                //Console.WriteLine("Case: " + i);
                int caseLine = i + 1;
                string line = lines[caseLine];
                string result = solveCase(line);
                sb.AppendLine("Case #" + (i + 1) + ": " + result);
            }
            return sb.ToString();
        }
    }

}

