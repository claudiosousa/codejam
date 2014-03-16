class Case
{
    public string[][] input;
    public string output;

    public static Case[] parseinput(string input)
    {
        string[] lines = input.Trim().Split('\n');

        int nbCases = Convert.ToInt32(lines[0]);
        int linesPerCase = (lines.Length - 1) / nbCases;

        Case[] cases = new Case[nbCases];

        for (int i = 0; i < nbCases; i++)
        {
            var caseLine = i * linesPerCase + 1;
            Case newcase = new Case { input = new string[linesPerCase][] };

            for (var iLine = 0; iLine < linesPerCase; iLine++)
            {
                newcase.input[iLine] = lines[caseLine + iLine].Split(' ');
            }
            cases[i] = newcase;
        }
        return cases;
    }
}