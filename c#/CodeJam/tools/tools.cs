using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;

namespace CodeJam
{
    static class Tools
    {
        public static decimal goldenNumber = (1 + (decimal)Math.Sqrt(5)) / 2;

        public static BigInteger Sqrt(BigInteger N)
        {
            if (0 == N)
                return 0;
            BigInteger n1 = (N >> 1) + 1;
            BigInteger n2 = (n1 + (N / n1)) >> 1;
            while (n2 < n1)
            {
                n1 = n2;
                n2 = (n1 + (N / n1)) >> 1;
            }
            return n1;
        }

        public static BigInteger FromBase(string number, int radix)
        {
            const string Digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

            if (radix < 2 || radix > Digits.Length)
                throw new ArgumentException("The radix must be >= 2 and <= " +
                    Digits.Length.ToString());

            if (String.IsNullOrEmpty(number))
                return 0;

            // Make sure the arbitrary numeral system number is in upper case
            number = number.ToUpperInvariant();

            BigInteger result = 0;
            BigInteger multiplier = 1;
            for (int i = number.Length - 1; i >= 0; i--)
            {
                char c = number[i];
                if (i == 0 && c == '-')
                {
                    // This is the negative sign symbol
                    result = -result;
                    break;
                }

                int digit = Digits.IndexOf(c);
                if (digit == -1)
                    throw new ArgumentException(
                        "Invalid character in the arbitrary numeral system number",
                        "number");

                result += digit * multiplier;
                multiplier *= radix;
            }

            return result;
        }

        public static string ToBase(BigInteger value, int @base = 0, string chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")
        {
            if (@base <= 0) @base = chars.Length;
            var sb = new StringBuilder();
            do
            {
                int m = (int)(value % @base);
                sb.Insert(0, chars[m]);
                value = (value - m) / @base;
            } while (value > 0);
            return sb.ToString();
        }

        public static string printArrayofArray(Array arr)
        {
            string res = "\r\n";
            var x = arr.GetLength(0);
            for (int i = 0; i < x; i++)
            {
                var line = (Array)arr.GetValue(i);
                var y = line.GetLength(0);
                for (int j = 0; j < y; j++)
                {
                    object value = line.GetValue(j);
                    if (value is Boolean)
                        value = (bool)value ? 1 : 0;
                    res += value + "";
                }
                res += "\r\n";
            }
            return res;
        }
        public static string printArray(Array arr)
        {
            string res = "\r\n";
            var x = arr.GetLength(0);
            var y = arr.GetLength(1);
            for (int j = 0; j < y; j++)
            {
                for (int i = 0; i < x; i++)
                {
                    object value = arr.GetValue(i, j);
                    if (value is Boolean)
                        value = (bool)value ? 1 : 0;
                    res += value + "";
                }
                res += "\r\n";
            }
            return res;
        }
    }
}
