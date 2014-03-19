using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CodeJam
{
    static class tools
    {
        public static string printArray(Array arr)
        {
            string res = "\r\n";
            var x = arr.GetLength(0);
            var y = arr.GetLength(1);
            for (int j = 0; j < y; j++)
            {
                for (int i = 0; i < x; i++)
                {
                    res+=arr.GetValue(i,j) + "";
                }
                res += "\r\n";
            }
            return res;
        }
    }
}
