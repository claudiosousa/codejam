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
        Dictionary<int, Dictionary<int, int>> table = new Dictionary<int, Dictionary<int, int>>();
        public Solver()
        {
            var dic = new Dictionary<int, int>();
            dic.Add(1, 1);
            dic.Add(2, 2);
            dic.Add(3, 3);
            dic.Add(4, 4);
            table.Add(1, dic);

            dic = new Dictionary<int, int>();
            dic.Add(1, 2);
            dic.Add(2, -1);
            dic.Add(3, 4);
            dic.Add(4, -3);
            table.Add(2, dic);

            dic = new Dictionary<int, int>();
            dic.Add(1, 3);
            dic.Add(2, -4);
            dic.Add(3, -1);
            dic.Add(4, 2);
            table.Add(3, dic);

            dic = new Dictionary<int, int>();
            dic.Add(1, 4);
            dic.Add(2, 3);
            dic.Add(3, -2);
            dic.Add(4, -1);
            table.Add(4, dic);

            for (int i = 0; i < table.Keys.Count; i++)
            {
                var row = table[table.Keys.ElementAt(i)];
                var rowKeys = row.Keys.Count;
                for (int j = 0; j < rowKeys; j++)
                {
                    int colHeader = row.Keys.ElementAt(j);
                    row.Add(-colHeader, -row[colHeader]);
                }
            }
            var keysCount = table.Keys.Count;
            for (int i = 0; i < keysCount; i++)
            {
                var rowHeader = table.Keys.ElementAt(i);
                var row = table[rowHeader];
                dic = new Dictionary<int, int>();
                var rowKeys = row.Keys.Count;
                for (int j = 0; j < rowKeys; j++)
                {
                    int colHeader = row.Keys.ElementAt(j);
                    dic.Add(colHeader, -row[colHeader]);
                }
                table.Add(-rowHeader, dic);
            }
        }

        int multiply(int val1, int val2)
        {
            return table[val1][val2];
        }

        ulong strLength;
        byte[] str2byte;
        ulong byteCount;
        bool canFindChar(int char2find, ulong index)
        {
            int mult = 1;
            while (index < strLength)
            {
                int nextChar = str2byte[index % byteCount];
                mult = multiply(mult, nextChar);
                if (char2find!= 4 && char2find == mult)
                {
                    if (canFindChar(char2find + 1, index + 1))
                        return true;
                }
                index++;    
            }
            return mult == char2find;
        }

        string solveCase(string[][] input)
        {
            var str = input[1][0];
            byteCount = (ulong)str.LongCount();
            strLength = ulong.Parse(input[0][1]) * byteCount;
            str2byte = new byte[byteCount];
            for (int i = 0; i < str.Length; i++)
            {
                str2byte[i] = (byte)((int)str[i] - 103);
            }
            return canFindChar(2, 0) ? "YES" : "NO";
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

                int caseLines = 1;
                string[][] caseInput = new string[caseLines + 1][];
                caseInput[0] = lineParts;

                for (var caseLine = 0; caseLine < caseLines; caseLine++)
                {
                    iLine++;
                    lineParts = lines[iLine].Split(' ');
                    caseInput[caseLine + 1] = lineParts;
                }
                string result = solveCase(caseInput);
                sb.AppendLine("Case #" + (i + 1) + ": " + result);
                iLine++;
            }
            return sb.ToString();
        }
    }

}

