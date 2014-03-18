using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace CodeJam
{
    static class Solver
    {

        static void processCase(Case cas)
        {

            int milkshakesNb = (int)cas.input[0][0];
            int personsNb = (int)cas.input[1][0];
            ExpandoObject[] persons = new ExpandoObject[personsNb];
            bool[] shakes = new bool[milkshakesNb];
            for (int i = 0; i < personsNb; i++)
            {
                var personLine = cas.input[2 + i];
                int personShakesNb = (int)personLine[0];
                dynamic person = new ExpandoObject();
                person.malted = null;
                person.regularShakes = new List<int>();
                for (int ips = 0; ips < personShakesNb; ips++)
                {
                    int shakeIndex = (int)personLine[1 + ips * 2];
                    bool malted = personLine[1 + ips * 2 + 1] == 1;
                    if (malted)
                        person.malted = shakeIndex;
                    else
                        person.regularShakes.Add(shakeIndex);
                }

                persons[i] = person;
            }

            bool changedShakes = false;
            bool impossible = false;
            do
            {
                changedShakes = false;
                for (int i = 0; i < personsNb; i++)
                {
                    dynamic person = persons[i];
                    var hasOneCommonRegularShake = ((List<int>)person.regularShakes).Any((rsi) => !shakes[rsi - 1]);
                    if (!hasOneCommonRegularShake)
                    {
                        if (person.malted != null)
                        {
                            if (!shakes[person.malted - 1])
                            {
                                shakes[person.malted - 1] = true;
                                changedShakes = true;
                            }
                        }
                        else
                            impossible = true;
                    }
                }
            } while (changedShakes && !impossible);
            if (impossible)
                cas.output = "IMPOSSIBLE";
            else
            {
                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < shakes.Length; i++)
                {
                    sb.Append(!shakes[i] ? "0 " : "1 ");
                }
                cas.output = sb.ToString().TrimEnd();
            }
        }


        public static string Solve(string input)
        {
            Case[] cases = createCases(input);
            for (int i = 0; i < cases.Length; i++)
            {
                Console.WriteLine(i + "");
                processCase(cases[i]);
            }
            return writeOutput(cases);
        }

        static Case[] createCases(string input)
        {
            string[] lines = input.Trim().Split('\n');

            long nbCases = Convert.ToInt64(lines[0]);

            Case[] cases = new Case[nbCases];
            int currentLineI = 1;
            for (int i = 0; i < nbCases; i++)
            {
                List<long[]> newcaseLines = new List<long[]>();
                newcaseLines.Add(new long[] { Convert.ToInt64(lines[currentLineI++]) });
                var personsNb = Convert.ToInt32(lines[currentLineI++]);
                newcaseLines.Add(new long[] { personsNb });


                for (var iLine = 0; iLine < personsNb; iLine++)
                {
                    string[] lineParts = lines[currentLineI++].Split(' ');
                    newcaseLines.Add(lineParts.Select(p => Convert.ToInt64(p)).ToArray());
                }
                Case newcase = new Case { input = newcaseLines.ToArray() };
                cases[i] = newcase;
            }
            return cases;
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
    }
}

