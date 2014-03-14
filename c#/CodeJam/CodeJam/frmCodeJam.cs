using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace CodeJam
{
    public partial class frmCodeJam : Form
    {
        public frmCodeJam()
        {
            InitializeComponent();
        }

        private void btnSolve_Click(object sender, EventArgs e)
        {
            tbOutput.Text = Solver.Solve(tbInput.Text);
        }

    }
}
