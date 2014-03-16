class Case
{
    public int[][] input;
    public string output;

    public static Case[] parseinput(string input)
    {
        string[] lines = input.Trim().Split('\n');

        long nbCases = Convert.ToInt64(lines[0]);
        long linesPerCase = (lines.Length - 1) / nbCases;

        Case[] cases = new Case[nbCases];

        for (int i = 0; i < nbCases; i++)
        {
            var caseLine = i * linesPerCase + 1;
            Case newcase = new Case { input = new int[linesPerCase][] };

            for (var iLine = 0; iLine < linesPerCase; iLine++)
            {
                string[] lineParts = lines[caseLine + iLine].Split(' ');
                newcase.input[iLine] = lineParts.Select(p => Convert.ToInt32(p)).ToArray();
            }
            cases[i] = newcase;
        }
        return cases;
    }
}