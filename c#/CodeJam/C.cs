using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;

namespace C
{
	class C
	{
		const string W = "welcome to code jam";
		static string I;
		static long[,] D;

		static void Main(string[] args)
		{
            StreamReader sr = new StreamReader("C-small.in");
			StreamWriter sw = new StreamWriter("out.txt");

			//string ts = "";
			//for (int i = 0; i < W.Length; i++)
			//    for (int j = 0; j < 30; j++)
			//        ts += W[i];

			int N = int.Parse(sr.ReadLine());

			for (int tc = 0; tc < N; tc++)
			{
				I = sr.ReadLine();

				D = new long[I.Length + 1, W.Length + 1];
				for (int i = 0; i <= D.GetUpperBound(0); i++)
					for (int j = 0; j <= D.GetUpperBound(1); j++)
						D[i, j] = -1;

				string r = res(0, 0).ToString();
				if (r.Length > 4)
					r = r.Remove(0, r.Length - 4);
				sw.WriteLine("Case #{0}: {1}", tc + 1, r.PadLeft(4, '0'));
			}

			sr.Close();
			sw.Close();
		}

		static long res(int s, int c)
		{
			if (c == W.Length)
				return 1;
			if (D[s, c] == -1)
			{
				long r = 0;
				for (int i = s; i < I.Length; i++)
					if (I[i] == W[c])
					{
						r += res(i, c + 1);
						r %= 1000000000;
					}

				D[s, c] = r;
			}
			return D[s, c];
		}
	}
}
