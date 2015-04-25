using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CodeJam.algos
{
    public static class BinarySearch
    {/*
        public static void Test()
        {
            int[] vector = new int[100];
            for (int i = 0; i < vector.Length; i++)
			{
			 vector[i]=(int)Math.Pow(i, 2);
			}
            Func<long, bool> isLastSmallerThan1000 = (i=>vector.Length>i && vector[i]<1000);
            Console.WriteLine(FindLastTrue(isLastSmallerThan1000) + "");
        }
        */
        public static long FindLastMatchingFromBeginning(Func<long, bool> match)
        {
            long left = 0, right = 1;
            while (match(right))
            {
                left = right;
                right *= 2;
            }

            while (right - left > 1)
            {
                long k = (left + right) / 2;
                if (match(k))
                    left = k;
                else
                    right = k;
            }
            return left;
        }

        public static int FindLastMatchingFromBeginning<T>(this IList<T> list, Func<T, bool> match) 
        {
            int left = 0, right = 1;
            if (!match(list[0]))
                return -1;
         
            while (list.Count>right && match(list[right]))
            {
                left = right;
                right *= 2;
            }

            while (right - left > 1)
            {
                int k = (left + right) / 2;
                if (list.Count > k && match(list[k]))
                    left = k;
                else
                    right = k;
            }
            return left;
        }

        public static int FindLastMatching<T>(this IList<T> list, Func<T, bool> match)
        {
            int left = 0, right = list.Count - 1;
            if (!match(list[left]))
                return -1;
            if (match(list[right]))
                return right;

            while (right - left > 1)
            {
                int k = (left + right) / 2;
                if (match(list[k]))
                    left = k;
                else
                    right = k;
            }
            return left;
        }
    }
}
