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

        static List<BigInteger> fairAndSquares = new List<BigInteger>(new BigInteger[] { 9 });

        public static bool isPalindrome(string pal)
        {
            var helf = Math.Ceiling((double)pal.Length / 2);
            for (int i = 0; i < helf; i++)
            {
                if (pal[i] != pal[pal.Length - 1 - i])
                    return false;
            }
            return true;
        }

        static void tryAddPalindromesFromHalf(string half)
        {
            string otherHalf = new String(half.Reverse().ToArray());
            BigInteger palindrom;
            BigInteger.TryParse(half + otherHalf, out palindrom);
            palindrom = BigInteger.Pow(palindrom, 2);
            if (isPalindrome(palindrom + ""))
                fairAndSquares.Add(palindrom);
            BigInteger.TryParse(half + otherHalf.Substring(1), out palindrom);
            palindrom = BigInteger.Pow(palindrom, 2);
            if (isPalindrome(palindrom + ""))
                fairAndSquares.Add(palindrom);
        }

        static void buildPalHalf(string half, int pos)
        {
            if (pos == 51)
                return;
            int startPos = 0;
            if (pos == 0)
                startPos = 1;
            for (int i = startPos; i < 3; i++)
            {
                half += i;
                tryAddPalindromesFromHalf(half);
                buildPalHalf(half, pos + 1);
            }

        }

        static void initialize()
        {
            buildPalHalf("", 0);
         
            fairAndSquares.Sort();
            for (int i = 0; i < fairAndSquares.Count; i++)
            {
                BigInteger fanda = fairAndSquares[i];
                Console.WriteLine(fanda);
            }
        }
        static void processCase(Case cas)
        {


            cas.output = fairAndSquares.Where(l => l >= cas.input[0] && l <= cas.input[1]).Count() + "";
        }


        public static string Solve(string input)
        {
            initialize();

            Case[] cases = Case.parseinput(input);
            for (int i = 0; i < cases.Length; i++)
            {
                Console.WriteLine("Case: " + i);
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
            public long[] input;
            public string output;

            public static Case[] parseinput(string input)
            {
                string[] lines = input.Trim().Split('\n').Select(l => l.TrimEnd('\r')).ToArray();

                long nbCases = Convert.ToInt64(lines[0]);
                Case[] cases = new Case[nbCases];

                for (int i = 0; i < nbCases; i++)
                {
                    var caseLine = i + 1;
                    var lineParts = lines[caseLine].Split(' ');
                    Case newcase = new Case { input = lineParts.Select(n => Convert.ToInt64(n)).ToArray() };
                    cases[i] = newcase;
                }
                return cases;
            }
        }
    }

}

