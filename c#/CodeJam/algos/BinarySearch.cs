using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CodeJam.algos
{
    static class BinarySearch
    {
        public static void Test()
        {
            int[] vector = new int[100];
            for (int i = 0; i < vector.Length; i++)
			{
			 vector[i]=(int)Math.Pow(i, 2);
			}
            Func<long, bool> isLastSmallerThan1000 = (i=>vector.Length>i && vector[i]<1000);
            Console.WriteLine(Solve(isLastSmallerThan1000)+"");
        }

        static long Solve(Func<long, bool> checkForWidthinBoundaries)
        {
            long left = 0, right = 1;
            while (checkForWidthinBoundaries(right))
            {
                left = right;
                right *= 2;
            }

            while (right - left > 1)
            {
                long k = (left + right) / 2;
                if (checkForWidthinBoundaries(k))
                    left = k;
                else
                    right = k;
            }
            return left;
        }
    }
}
