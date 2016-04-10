using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Excel = Microsoft.Office.Interop.Excel;
namespace MCX.Tests
{

    [TestClass]
    public class Program
    {
        const string fileName = "D:\\Book1.xlsx";
        const string topLeft = "A1";
        const string bottomRight = "A4";
        const string graphTitle = "Graph Title";
        const string xAxis = "Time";
        const string yAxis = "Value";


        [TestMethod]
        public void Main()
        {

            method1();
            // Open Excel and get first worksheet.
            var application = new Excel.Application();
            var workbook = application.Workbooks.Open(fileName);
            var worksheet = workbook.Worksheets[1] as Microsoft.Office.Interop.Excel.Worksheet;

            // Add chart.
            var charts = worksheet.ChartObjects() as
                Microsoft.Office.Interop.Excel.ChartObjects;
            var chartObject = charts.Add(60, 10, 300, 300) as
                Microsoft.Office.Interop.Excel.ChartObject;
            var chart = chartObject.Chart;

            // Set chart range.
            var range = worksheet.get_Range(topLeft, bottomRight);
            chart.SetSourceData(range);

            // Set chart properties.
            chart.ChartType = Microsoft.Office.Interop.Excel.XlChartType.xlLine;
            chart.ChartWizard(Source: range,
                Title: graphTitle,
                CategoryTitle: xAxis,
                ValueTitle: yAxis);

            // Save.
            workbook.Save();
        }

        [TestMethod]
        void method1()
        {



            Excel.Application xlApp = new Excel.Application();
            Excel.Workbook xlWorkbook = xlApp.Workbooks.Open(fileName, 0, true, 5, "", "", true, Excel.XlPlatform.xlWindows, "\t", false, false, 0, true, 1, 0);
            Excel._Worksheet xlWorksheet = (Excel._Worksheet)xlWorkbook.Sheets[1];
            Excel.Range xlRange = xlWorksheet.UsedRange;

            int rowCount = xlRange.Rows.Count;
            int colCount = xlRange.Columns.Count;


            StringBuilder sb = new StringBuilder();


            for (int i = 1; i <= rowCount; i++)
            {
                for (int j = 1; j <= colCount; j++)
                {

                    sb.Append(xlWorksheet.Cells[i, j].ToString());
                    //MessageBox.Show(xlWorksheet.Cells[i, j].ToString());
                }
            }
        }
    }

}
