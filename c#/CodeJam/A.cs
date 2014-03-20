using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ConsoleApplication1
{
    class A
    {
        static int[] pocz;
        static string[] table;
        static int N,K;
        static int getColor(int x)
        {
            pocz[x]--;
            while (pocz[x] >= 0 && table[N - x -1][pocz[x]] == '.' )
            {
                pocz[x]--;
            }
            if (pocz[x] < 0) return 0;
            if (table[N - x -1][pocz[x]] == 'R') return 1; else return -1;
        }

        static void Main(string[] args)
        {
            int T = int.Parse(Console.ReadLine());
            
            for (int o = 1; o <= T; o++)
            {
                string[] tmp = Console.ReadLine().Split();
                N = int.Parse(tmp[0]);
                K = int.Parse(tmp[1]);
                table=new string[N];
                for (int i = 0; i < N; i++)
                {
                    table[i] = Console.ReadLine();
                }

                pocz = new int[N];
                for (int i = 0; i < N; i++) pocz[i] = N;
                int[, ,] counter = new int[N, N, 8];//left, bottom, left-bottom, right-bottom
                bool isRed = false;
                bool isBlue = false;
                for (int i = 0; i < N; i++)
                {
                    bool change = false;
                    for (int j = 0; j < N; j++)
                    {
                        int color = getColor(j);
                        if (color > 0)//red
                        {
                            counter[i, j, 0] = (j>0?counter[i, j-1, 0]:0) + 1;
                            counter[i, j, 2] = (j>0&&i>0?counter[i - 1, j-1, 2]:0) + 1;
                            counter[i, j, 1] = (i> 0?counter[i-1, j, 1]:0) + 1;
                            counter[i, j, 3] = (j < N - 1 && i> 0? counter[i-1, j + 1, 3]:0) + 1;
                            if (counter[i, j, 0] >= K || counter[i, j, 1] >= K || counter[i, j, 2] >= K || counter[i, j, 3] >= K) isRed = true;
                            counter[i, j, 4] = counter[i, j, 5] = counter[i, j, 6] = counter[i, j, 7] = 0;
                            change = true;
                        }
                        else if (color < 0)//blue
                        {
                            counter[i, j, 4] = (j > 0 ? counter[i, j - 1, 4] : 0) + 1;
                            counter[i, j, 6] = (j > 0 && i > 0 ? counter[i - 1, j - 1, 6] : 0) + 1;
                            counter[i, j, 5] = (i > 0 ? counter[i - 1, j, 5] : 0) + 1;
                            counter[i, j, 7] = (j < N - 1 && i > 0 ? counter[i - 1, j + 1, 7] : 0) + 1;
                            if (counter[i, j, 4] >= K || counter[i, j, 5] >= K || counter[i, j, 6] >= K || counter[i, j, 7] >= K) isBlue = true;
                            counter[i, j, 0] = counter[i, j, 1] = counter[i, j, 2] = counter[i, j, 3] = 0;
                            change = true;

                        }
                        else
                        {
                            counter[i, j, 0] = counter[i, j, 1] = counter[i, j, 2] = counter[i, j, 3] = counter[i, j, 4] = counter[i, j, 5] = counter[i, j, 6] = counter[i, j, 7] = 0;
                        }


                    }
                    if (!change) break;
                }

                Console.Write("Case #" + o + ": ");
                if (isRed && isBlue) Console.WriteLine("Both");
                else if (isRed) Console.WriteLine("Red");
                else if (isBlue) Console.WriteLine("Blue");
                else Console.WriteLine("Neither");

            }


            Console.ReadLine();
        }
    }
}
