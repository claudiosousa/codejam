using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace CodeJam
{

    class Solver
    {
        class car
        {
            public char start;
            public char end;
        }

        Dictionary<int, BigInteger> factorials = new Dictionary<int, BigInteger>();
        BigInteger factorial(int n)
        {
            if (n == 1)
                return 1;

            if (factorials.ContainsKey(n))
                return factorials[n];

            BigInteger bigINt = new BigInteger(n);
            var res = bigINt * factorial(n - 1);
            res = res % 1000000007;
            factorials[n] = res;
            return res;
        }

        string solveCase(string[][] input)
        {
            Dictionary<char, car> carsbystart = new Dictionary<char, car>();
            Dictionary<char, car> carsbyend = new Dictionary<char, car>();
            Dictionary<char, int> sameLetters = new Dictionary<char, int>();
            HashSet<char> middleChars = new HashSet<char>();
            for (int i = 0; i < input[1].Length; i++)
            {
                string str = input[1][i];
                var start = str[0]; ;
                var end = str[str.Length - 1];

                var strmiddle = "";
                if (str.Length > 2)
                {
                    strmiddle = str.Substring(1, str.Length - 2);
                    while (strmiddle.Length > 0 && strmiddle[0] == start)
                        strmiddle = strmiddle.Remove(0, 1);
                    while (strmiddle.Length > 0 && strmiddle[strmiddle.Length - 1] == end)
                        strmiddle = strmiddle.Remove(strmiddle.Length - 1, 1);

                    if (strmiddle.Length > 0 && start == end)
                        return "0";
                    char last = 'Y';
                    for (int j = 0; j < strmiddle.Length; j++)
                    {
                        char c = strmiddle[j];
                        if (c == last)
                            continue;
                        last = c;
                        if (middleChars.Contains(c))
                            return "0";
                        middleChars.Add(c);
                    }
                }
                if (start == end)
                {
                    if (strmiddle.Length > 0)
                        return "0";
                    else
                    {
                        if (sameLetters.ContainsKey(start))
                            sameLetters[start] = sameLetters[start] + 1;
                        else
                            sameLetters[start] = 1;
                    }
                }
                else
                {
                    car car = new car();
                    car.start = start;
                    car.end = end;
                    if (carsbystart.ContainsKey(car.start))
                        return "0";
                    if (carsbyend.ContainsKey(car.end))
                        return "0";
                    carsbystart.Add(car.start, car);
                    carsbyend.Add(car.end, car);
                }

            }
            foreach (char key in carsbystart.Keys)
            {
                if (middleChars.Contains(key))
                    return "0";
            }
            foreach (char key in carsbyend.Keys)
            {
                if (middleChars.Contains(key))
                    return "0";
            }

            Dictionary<char, car> carsbystartBkp = new Dictionary<char, car>(carsbystart);
            Dictionary<char, car> carsbyendBkp = new Dictionary<char, car>(carsbyend);

            List<BigInteger> groupCombiList = new List<BigInteger>();
            do
            {
                BigInteger groupCombis = 1;
                if (carsbystart.Keys.Count > 0)
                {
                    List<char> charsIUsed = new List<char>();
                    car first = carsbystart.First().Value;
                    char start = first.start;
                    char end = first.end;
                    carsbystart.Remove(start);
                    carsbyend.Remove(end);
                    charsIUsed.Add(start);
                    charsIUsed.Add(end);
                    char startLinkChar = start;
                    char endLinkChar = end;
                    while (carsbyend.ContainsKey(start))
                    {
                        var previous = carsbyend[start];
                        carsbyend.Remove(previous.end);
                        carsbystart.Remove(previous.start);
                        start = previous.start;
                        charsIUsed.Add(start);
                        startLinkChar = start;
                    }

                    while (carsbystart.ContainsKey(end))
                    {
                        var next = carsbystart[end];
                        carsbyend.Remove(next.end);
                        carsbystart.Remove(next.start);
                        end = next.end;
                        charsIUsed.Add(end);
                        endLinkChar = end;
                    }

                    if (startLinkChar == endLinkChar || carsbystartBkp.ContainsKey(endLinkChar) || carsbyendBkp.ContainsKey(startLinkChar))
                        return "0";
                    for (int i = 0; i < charsIUsed.Count; i++)
                    {
                        var charUsed = charsIUsed[i];
                        if (sameLetters.ContainsKey(charUsed))
                        {
                            int sameLetterstimes = sameLetters[charUsed];
                            groupCombis = groupCombis * factorial(sameLetterstimes);
                            groupCombis = groupCombis % 1000000007;
                            sameLetters.Remove(charUsed);
                        }
                    }
                }
                else if (sameLetters.Count > 0)
                {
                    var first = sameLetters.First();
                    sameLetters.Remove(first.Key);
                    groupCombis = groupCombis * factorial(first.Value);
                    groupCombis = groupCombis % 1000000007;
                }
                else if (carsbyend.Keys.Count > 0)
                {

                }
                else
                    break;
                groupCombiList.Add(groupCombis);
            } while (true);
            BigInteger totalCombis = 1;
            for (int i = 0; i < groupCombiList.Count; i++)
            {
                totalCombis *= groupCombiList[i];
                totalCombis = totalCombis % 1000000007;
            }

            totalCombis *= factorial(groupCombiList.Count);
            totalCombis = totalCombis % 1000000007;
            return totalCombis + "";
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

