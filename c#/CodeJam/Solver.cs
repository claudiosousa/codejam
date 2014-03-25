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

        static List<BigInteger> fairAndSquares = new List<BigInteger>(new BigInteger[] { 1, 4, 9 });

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

        static void initialize()
        {

           
            string halfPal = "";
            string otherHalf;
            BigInteger palindrom;
            for (int exp = 0; exp < 50; exp++) { 

                for (BigInteger j = 1; j <= firstHalfFrom; j++)
                {
                    halfPal = Tools.Encode(j, 3);
                    otherHalf = new String(halfPal.Reverse().ToArray());
                    BigInteger.TryParse(halfPal + otherHalf, out palindrom);
                    palindrom = BigInteger.Pow(palindrom, 2);
                    if (isPalindrome(palindrom + ""))
                    {
                        fairAndSquares.Add(palindrom);
                    }
                    for (int j2 = 0; j2 < 3; j2++)
                    {
                        BigInteger.TryParse(halfPal + j2 + otherHalf, out palindrom);
                        palindrom = BigInteger.Pow(palindrom, 2);
                        if (isPalindrome(palindrom + ""))
                        {
                            fairAndSquares.Add(palindrom);
                        }

                    }
                }
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

