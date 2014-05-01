﻿using System;
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
        int size = 1000;
        int times = 100;
        int[,] bad = null;

        int[] arr = null;
        Random rnd = new Random();
        double indicator = 0;

        void generateRandom()
        {
            int[] array = new int[size];
            arr.CopyTo(array, 0);
            for (int j = 0; j < size; j++)
            {
                int pos = rnd.Next(size);
                var t = array[j];
                array[j] = array[pos];
                array[pos] = t;
            }
            for (int j = 0; j < size; j++)
            {
                var v = array[j];
                bad[v, j]++;
            }
        }
        void calculateOdds()
        {
            int[] array = new int[size];
            arr.CopyTo(array, 0);
            for (int j = 0; j < size; j++)
            {
                int pos = rnd.Next(size);
                var t = array[j];
                array[j] = array[pos];
                array[pos] = t;
            }
            indicator+=getINdicator(array);          
        }

        double getINdicator(int[] numbers)
        {
            double sum = 0;
            for (int i = 0; i < numbers.Length; i++)
            {
                var v = numbers[i];
                sum += (double)bad[v, i] / times;
            }
            return sum;
        }
        void itnialize()
        {
            if (bad != null)
                return;
            bad = new int[size, size];
            arr = new int[size];
            for (int i = 0; i < size; i++)
                arr[i] = i;

            for (int i = 0; i < times * size; i++)
            {
                generateRandom();
            }

            for (int i = 0; i < times * size; i++)
            {
                calculateOdds();
            }
            indicator /= times * size;
            // Parallel.For(0, times * size, new Action<int>(generateRandom));
        }

        string solveCase(int[][] input)
        {         
            var numbers = input[0];
            var inputINdicator = getINdicator(numbers);
         
            return inputINdicator > (indicator + 1000)/2? "BAD" : "GOOD";
        }



        public string Solve(string input)
        {
            itnialize();

            string[] lines = input.Trim().Split('\n').Select(l => l.TrimEnd('\r')).ToArray();

            StringBuilder sb = new StringBuilder();
            int nbCases = Convert.ToInt32(lines[0]);
            int iLine = 1;
            for (int i = 0; i < nbCases; i++)
            {
                string[] lineParts = lines[iLine].Split(' ');
                int[] linePartsint = lineParts.Select(p => Convert.ToInt32(p)).ToArray();

                int caseLines = 1;
                int[][] caseInput = new int[caseLines][];
                caseInput[0] = linePartsint;

                for (var caseLine = 0; caseLine < caseLines; caseLine++)
                {
                    iLine++;
                    lineParts = lines[iLine].Split(' ');
                    linePartsint = lineParts.Select(p => Convert.ToInt32(p)).ToArray();
                    caseInput[caseLine] = linePartsint;
                }
                string result = solveCase(caseInput);
                sb.AppendLine("Case #" + (i + 1) + ": " + result);
                iLine++;
            }
            return sb.ToString();
        }
    }

}

