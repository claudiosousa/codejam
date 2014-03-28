﻿using CodeJam.algos;
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
        static int[,] enargyData;
        static int[] activities;
        static int[][] maxEnergyActivitiesIndex;
        static int eMax;
        static int r;


        static void processCase(Case cas)
        {
            eMax = cas.input[0][0];
            r = cas.input[0][1];
            activities = cas.input[1];
            enargyData = new int[activities.Length, 2];
            maxEnergyActivitiesIndex = new int[activities.Length][];

            for (int i = 0; i < activities.Length; i++)
            {
                maxEnergyActivitiesIndex[i] = new int[] { i, activities[i] };

                enargyData[i, 0] = r; //min input
                enargyData[i, 1] = eMax; //max output
            }
            enargyData[0, 0] = eMax; //in = e max
            enargyData[activities.Length - 1, 2] = 0; //max out = e 0

            maxEnergyActivitiesIndex = maxEnergyActivitiesIndex.OrderByDescending(ac => ac[1]).ToArray();

            long energyTotal = 0;
            for (int i = 0; i < maxEnergyActivitiesIndex.Length; i++)
            {
                var activityEnergy = maxEnergyActivitiesIndex[i][1];
                var maxAvailableE = i>0?maxEnergyActivitiesIndex[i-1][1]:eMax;
                activityEnergy = maxAvailableE*activityEnergy;
                energyTotal += activityEnergy;
                maxEnergyActivitiesIndex[i][2] = 
            }
            //Console.WriteLine(Tools.printArray(maxVal));
            cas.output = "";
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

