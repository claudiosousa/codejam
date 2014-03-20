using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CodeJam.tools
{
    static class Tools
    {
        static decimal goldenNumber = (1 + (decimal)Math.Sqrt(5)) / 2;
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
