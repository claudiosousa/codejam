using CodeJam.algos;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace CodeJam
{

    class Solver
    {
        static long[,] enargyData;
        static int[] activities;
        static int[][] maxEnergyActivitiesIndex;
        static int eMax;
        static int r;


        static void processCase(Case cas)
        {
            eMax = cas.input[0][0];
            r = cas.input[0][1];
            activities = cas.input[1];
            enargyData = new long[activities.Length, 3];
            maxEnergyActivitiesIndex = new int[activities.Length][];

            for (int i = 0; i < activities.Length; i++)
            {
                maxEnergyActivitiesIndex[i] = new int[] { i, activities[i] };

                enargyData[i, 0] = r; //min required energy
                enargyData[i, 1] = eMax; //max energy left
                enargyData[i, 2] = -1; //energyConsumed
            }

            maxEnergyActivitiesIndex = maxEnergyActivitiesIndex.OrderByDescending(ac => ac[1]).ToArray();

            int afftetsNeighbourNTaks = eMax / r;

            long energyTotal = 0;
            for (int i = 0; i < maxEnergyActivitiesIndex.Length; i++)
            {
                var activityIndex = maxEnergyActivitiesIndex[i][0];
                long activityEnergy = maxEnergyActivitiesIndex[i][1];
                var maxAvailableE = activityIndex > 0 ? Math.Min(eMax, enargyData[activityIndex - 1, 1] + r) : eMax;
                long minEnergyLeft = activityIndex < activities.Length - 1 ? Math.Max(0, enargyData[activityIndex + 1, 0] - r) : 0;
                long energy2use = maxAvailableE - minEnergyLeft;
                activityEnergy = (long)energy2use * activityEnergy;
                energyTotal += activityEnergy;

                enargyData[activityIndex, 0] = energy2use + minEnergyLeft;
                enargyData[activityIndex, 1] = minEnergyLeft;
                enargyData[activityIndex, 2] = energy2use;
                var currentEnergy = maxAvailableE - energy2use;
                for (int j = activityIndex + 1; j <= afftetsNeighbourNTaks + activityIndex && j < activities.Length; j++)
                {
                    if (enargyData[j, 2] != -1)
                        break;
                    currentEnergy += r;
                    if (currentEnergy > eMax)
                        break;
                    //  enargyData[j, 0] = currentEnergy - r;
                    enargyData[j, 1] = currentEnergy;
                }
                //energy2use -= r;
                for (int j = activityIndex - 1; j >= Math.Max(0, activityIndex - afftetsNeighbourNTaks-1); j--)
                {
                    if (enargyData[j, 2] != -1)
                        break;
                    energy2use -= r;
                    if (energy2use < 0)
                        break;
                    //   enargyData[j, 1] = energy2use + r;
                    enargyData[j, 0] = energy2use;
                }
            }
            //Console.WriteLine(Tools.printArray(maxVal));
            cas.output = "" + energyTotal;
        }

        public static string Solve(string input)
        {
            Case[] cases = Case.parseinput(input);
            for (int i = 0; i < cases.Length; i++)
            {
                Console.WriteLine("Case: " + i);
                processCase(cases[i]);
            }
            return writeOutput(cases);
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

        class Case
        {
            public int[][] input;
            public string output;

            public static Case[] parseinput(string input)
            {
                string[] lines = input.Trim().Split('\n');

                int nbCases = Convert.ToInt32(lines[0]);
                Case[] cases = new Case[nbCases];

                int iLine = 1;
                for (int i = 0; i < nbCases; i++)
                {
                    string[] lineParts = lines[iLine].Split(' ');
                    int[] linePartsint = lineParts.Select(p => Convert.ToInt32(p)).ToArray();

                    int caseLines = 1;
                    Case newcase = new Case { input = new int[caseLines + 1][] };
                    newcase.input[0] = linePartsint;

                    for (var caseLine = 0; caseLine < caseLines; caseLine++)
                    {
                        iLine++;
                        lineParts = lines[iLine].Split(' ');
                        linePartsint = lineParts.Select(p => Convert.ToInt32(p)).ToArray();
                        newcase.input[caseLine + 1] = linePartsint;
                    }
                    cases[i] = newcase;
                    iLine++;
                }
                return cases;
            }
        }
    }

}

