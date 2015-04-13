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

        List<ulong> findAllRightSums(int char2find, ulong start, ulong end)
        {
            List<ulong> res = new List<ulong>();
            int mult = 1;
            bool reverse = end < start;
            ulong index = start;
            while (reverse ? index > end : index < end)
            {
                int nextChar = str2byte[index % byteCount];
                if (reverse)
                    mult = multiply(nextChar, mult);
                else
                    mult = multiply(mult, nextChar);
                if (char2find == mult)
                {
                    res.Add(index);
                }
                if (reverse)
                    index--;
                else
                    index++;
            }
            return res;
        }

        List<ulong> iIndexes, kIndexes;
        List<KeyValuePair<ulong, bool>> ikIndexes;
        Dictionary<ulong, int> ikIndexesByValue;
        Dictionary<int, int> iStepSums;

        sbyte getSumValueBetween(ulong currentIVal, ulong currentKVal)
        {
            return 0;
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

            iIndexes = findAllRightSums(2, 0, strLength);
            if (iIndexes.Count == 0)
                return "NO";
            kIndexes = findAllRightSums(4, strLength - 1, iIndexes[0]);
            if (kIndexes.Count == 0)
                return "NO";
            ikIndexesByValue = new Dictionary<ulong, int>();
            ikIndexes = new List<KeyValuePair<ulong, bool>>(iIndexes.Select(i => new KeyValuePair<ulong, bool>(i, true)));
            ikIndexes.AddRange(kIndexes.Select(k => new KeyValuePair<ulong, bool>(k, false)));
            ikIndexes.Sort((a, b) => a.Key.CompareTo(b.Key));
            ikIndexes = new List<KeyValuePair<ulong, bool>>(ikIndexes.Distinct());
            iStepSums = new Dictionary<int, int>();
            for (int i = 0; i < ikIndexes.Count; i++)
            {
                var ikIndex = ikIndexes[i];
                if (!ikIndexesByValue.ContainsKey(ikIndex.Key))
                    ikIndexesByValue.Add(ikIndex.Key, i);
                if (i < ikIndexes.Count - 1)
                {
                    var nextikIndex = ikIndexes[i + 1];
                    int sum = 1;
                    var start = ikIndex.Value ? ikIndex.Key + 1 : ikIndex.Key;
                    var end = nextikIndex.Value ? nextikIndex.Key : nextikIndex.Key - 1;
                    for (ulong j = start; j <= end; j++)
                    {
                        int nextChar = str2byte[j % byteCount];
                        sum = multiply(sum, nextChar);
                    }
                    iStepSums.Add(i, sum);
                }

            }
            for (int i = 0; i < iIndexes.Count; i++)
            {
                ulong currentIVal = iIndexes[0];
                for (int k = 0; k < kIndexes.Count; k++)
                {
                    ulong currentKVal = kIndexes[0];
                    if (currentKVal <= currentIVal)
                        break;
                    int startIndex = ikIndexesByValue[currentIVal];
                    int endIndex = ikIndexesByValue[currentKVal];
                    int sum = 1;
                    for (int j = startIndex; j < endIndex; j++)
                    {
                        sum = multiply(sum, iStepSums[j]);
                    }
                    if (sum == 3)
                        return "YES";
                }

            }
            return "NO";
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

