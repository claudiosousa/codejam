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
        Dictionary<int, List<int>> tree;
        Dictionary<string, int> dp;

        int getMinDeletes(HashSet<int> removed, List<int[]> startNodes, int maxDeletes)
        {
            /*
            var removedList = removed.ToList();
            removedList.Sort();
            var removedListKey = String.Join(",", removedList);
            if (dp.ContainsKey(removedListKey))
                return dp[removedListKey];
             * */
            List<int[]> nodes2verify = new List<int[]>();
            for (int i = 0; i < startNodes.Count; i++)
            {
                nodes2verify.Add(startNodes[i]);
            }
            do
            {
                var node2verify = nodes2verify.Last();
                nodes2verify.RemoveAt(nodes2verify.Count - 1);
                int node = node2verify[0];
                int nodeParent = node2verify[1];
                var isRemovedNode = removed.Contains(nodeParent);
                if (isRemovedNode)
                    removed.Add(node);
                if (removed.Count > maxDeletes)
                {
                 //   dp[removedListKey] = -1;
                    return -1;
                }
                int[] nodeEdges = tree[node].ToArray();
                nodeEdges = nodeEdges.Where(e => e != nodeParent && !removed.Contains(e)).ToArray();

                if (!isRemovedNode && nodeEdges.Count() > 2)
                {
                    int nodes2remove = nodeEdges.Count() - 2;
                    List<int> toremove = new List<int>();
                    for (int i = 0; i < nodes2remove; i++)
                    {
                        toremove.Add(i);
                    }
                    HashSet<int> bestRemove = null;
                    int minDeleted = maxDeletes - removed.Count;
                    do
                    {
                        var tempRemoved = new HashSet<int>(removed);
                        List<int[]> removedStartNodes = new List<int[]>();
                        for (int i = 0; i < nodes2remove; i++)
                        {
                            removedStartNodes.Add(new int[] { nodeEdges[toremove[i]], node });
                            tempRemoved.Add(nodeEdges[toremove[i]]);
                        }

                        var deleted = getMinDeletes(tempRemoved, removedStartNodes, minDeleted);
                        if (deleted >= 0 && (bestRemove == null || tempRemoved.Count < bestRemove.Count))
                        {
                            bestRemove = tempRemoved;
                            minDeleted = bestRemove.Count;
                        }
                        var isValidConbination = false;
                        for (int i = nodes2remove - 1; i >= 0; i--)
                        {
                            var removeI = toremove[i];
                            removeI++;
                            toremove[i] = removeI;
                            if (removeI < nodeEdges.Count() + i - nodes2remove + 1)
                            {
                                isValidConbination = true;
                                for (int j = i + 1; j < nodes2remove; j++)
                                    toremove[j] = removeI + j - i;
                                break;
                            }
                        }
                        if (!isValidConbination)
                            break;
                    } while (true);
                    if (bestRemove == null)
                    {
                      //  dp[removedListKey] = -1;
                        return -1;
                    }
                    var bestRemoveList = bestRemove.ToList();
                    for (int i = 0; i < bestRemoveList.Count; i++)
                    {
                        if (!removed.Contains(bestRemoveList[i]))
                            removed.Add(bestRemoveList[i]);
                    }
                    if (removed.Count > maxDeletes)
                    {
                    //    dp[removedListKey] = -1;
                        return -1;
                    }
                }
                else if (!isRemovedNode && nodeEdges.Count() == 1)
                    removed.Add(nodeEdges[0]);

                for (int i = 0; i < nodeEdges.Count(); i++)
                {
                    nodes2verify.Add(new int[] { nodeEdges[i], node });
                }
            } while (nodes2verify.Count > 0);
          //  dp[removedListKey] = removed.Count;
            return removed.Count;
        }

        int getMinDeletes()
        {
            int minDeletes = tree.Keys.Count - 1;
            HashSet<int> minDeletesDeleted = null;
            foreach (int key in tree.Keys)
            {
                dp = new Dictionary<string, int>();
                var deleteed = new HashSet<int>();
                var start = new List<int[]>();
                start.Add(new int[] { key, 0 });
                int keyMinDeletes = getMinDeletes(deleteed, start, minDeletes);

                if (keyMinDeletes == 0)
                    return 0;
                if (keyMinDeletes > 0 && keyMinDeletes < minDeletes)
                {
                    minDeletes = keyMinDeletes;
                    minDeletesDeleted = deleteed;
                }
            }
            return minDeletes;
        }

        string solveCase(int[][] input)
        {
            int N = input[0][0];
            tree = new Dictionary<int, List<int>>();
            for (int i = 1; i <= N; i++)
            {
                tree.Add(i, new List<int>());
            }
            for (int i = 1; i < input.Length; i++)
            {
                int[] edge = input[i];
                tree[edge[0]].Add(edge[1]);
                tree[edge[1]].Add(edge[0]);
            }
            return getMinDeletes() + "";
        }


        public string Solve(string input)
        {
            string[] lines = input.Trim().Split('\n').Select(l => l.TrimEnd('\r')).ToArray();

            StringBuilder sb = new StringBuilder();
            int nbCases = Convert.ToInt32(lines[0]);
            int iLine = 1;
            for (int i = 0; i < nbCases; i++)
            {
                Console.WriteLine("Case: " + i);

                string[] lineParts = lines[iLine].Split(' ');
                int[] linePartsint = lineParts.Select(p => Convert.ToInt32(p)).ToArray();

                int caseLines = linePartsint[0] - 1;
                int[][] caseInput = new int[caseLines + 1][];
                caseInput[0] = linePartsint;

                for (var caseLine = 0; caseLine < caseLines; caseLine++)
                {
                    iLine++;
                    lineParts = lines[iLine].Split(' ');
                    linePartsint = lineParts.Select(p => Convert.ToInt32(p)).ToArray();
                    caseInput[caseLine + 1] = linePartsint;
                }
                string result = solveCase(caseInput);
                sb.AppendLine("Case #" + (i + 1) + ": " + result);
                iLine++;
                if (iLine >= lines.Length)
                    break;
            }
            return sb.ToString();
        }
    }

}

