using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace CodeJam
{
    public partial class frmCodeJam : Form
    {
        static string pathUser = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile);
        static string pathDownload = Path.Combine(pathUser, "Downloads");
        static string currentinputFile = "currentinput.txt";
        static Solver solver;
        public frmCodeJam()
        {
            InitializeComponent();
            this.FormClosing += frmCodeJam_FormClosing;

        }

        void frmCodeJam_FormClosing(object sender, FormClosingEventArgs e)
        {
            saveTemporarayFile();
        }

        private void btnSolve_Click(object sender, EventArgs e)
        {
            tbOutput.Text = solver.Solve(tbInput.Text);
        }

        private void frmCodeJam_Shown(object sender, EventArgs e)
        {
            if (File.Exists(currentinputFile))
                tbInput.Text = File.ReadAllText(currentinputFile);
            solver = new Solver();
        }

        private void btnLoadFile_Click(object sender, EventArgs e)
        {
            DirectoryInfo dinfo = new DirectoryInfo(pathDownload);
            FileInfo[] inFiles = dinfo.GetFiles("*.in");
            var lastInFile = inFiles.OrderBy(f => f.CreationTime).LastOrDefault();
            if (lastInFile != null)
            {
                tbInput.Text = File.ReadAllText(lastInFile.FullName).Replace("\n", "\r\n");
            }
        }

        private void btSaveFile_Click(object sender, EventArgs e)
        {
            var outPath = Path.Combine(pathDownload, "output.out");
            if (File.Exists(outPath))
                File.Delete(outPath);
            File.WriteAllText(outPath, tbOutput.Text);

            string codeoutPath = Path.Combine(pathDownload, "Solver.cs");
            if (File.Exists(codeoutPath))
                File.Delete(codeoutPath);
            string codeInPath = Path.Combine(Environment.CurrentDirectory, @"..\..\Solver.cs");
            File.Copy(codeInPath, codeoutPath, true);
        }

        void saveTemporarayFile()
        {
            File.WriteAllText(currentinputFile, tbInput.Text);
        }

        private void btnSave_Click(object sender, EventArgs e)
        {
            saveTemporarayFile();
        }

        private void btClearInput_Click(object sender, EventArgs e)
        {
            tbInput.Text = "";
        }


    }
}
