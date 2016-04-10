using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Excel = Microsoft.Office.Interop.Excel;

namespace MCX.HelperClass
{
    /// <summary>
    /// This class contains the Excel Interop code we need.
    /// It can be shared in many places to avoid duplication.
    /// </summary>
    class ExcelReaderInterop
    {
        /// <summary>
        /// Store the Application object we can use in the member functions.
        /// </summary>
        //System.Net.Mime.MediaTypeNames.Application _excelApp;

        /// <summary>
        /// Initialize a new Excel reader. Must be integrated
        /// with an Excel interface object.
        /// </summary>
        public ExcelReaderInterop()
        {
            //_excelApp = new Excel.Application();
        }


        ///// <summary>
        ///// Open the file path received in Excel. Then, open the workbook
        ///// within the file. Send the workbook to the next function, the internal scan
        ///// function. Will throw an exception if a file cannot be found or opened.
        ///// </summary>
        //public void ExcelOpenSpreadsheets(string thisFileName)
        //{
        //    try
        //    {
        //        //
        //        // This mess of code opens an Excel workbook. I don't know what all
        //        // those arguments do, but they can be changed to influence behavior.
        //        //
        //        Workbook workBook = _excelApp.Workbooks.Open(thisFileName,
        //            Type.Missing, Type.Missing, Type.Missing, Type.Missing,
        //            Type.Missing, Type.Missing, Type.Missing, Type.Missing,
        //            Type.Missing, Type.Missing, Type.Missing, Type.Missing,
        //            Type.Missing, Type.Missing);

        //        //
        //        // Pass the workbook to a separate function. This new function
        //        // will iterate through the worksheets in the workbook.
        //        //
        //        ExcelScanIntenal(workBook);

        //        //
        //        // Clean up.
        //        //
        //        workBook.Close(false, thisFileName, null);
        //        Marshal.ReleaseComObject(workBook);
        //    }
        //    catch
        //    {
        //        //
        //        // Deal with exceptions.
        //        //
        //    }
        //}

        ///// <summary>
        ///// Scan the selected Excel workbook and store the information in the cells
        ///// for this workbook in an object[,] array. Then, call another method
        ///// to process the data.
        ///// </summary>
        //private void ExcelScanIntenal(Workbook workBookIn)
        //{
        //    //
        //    // Get sheet Count and store the number of sheets.
        //    //
        //    int numSheets = workBookIn.Sheets.Count;

        //    //
        //    // Iterate through the sheets. They are indexed starting at 1.
        //    //
        //    for (int sheetNum = 1; sheetNum < numSheets + 1; sheetNum++)
        //    {
        //        Worksheet sheet = (Worksheet)workBookIn.Sheets[sheetNum];


        //        // Take the used range of the sheet. Finally, get an object array of all
        //        // of the cells in the sheet (their values). You can do things with those
        //        // values. See notes about compatibility.
        //        //
        //        Range excelRange = sheet.UsedRange;
        //        object[,] valueArray = (object[,])excelRange.get_Value(
        //            XlRangeValueDataType.xlRangeValueDefault);

        //        //
        //        // Do something with the data in the array with a custom method.
        //        //
        //        ProcessObjects(valueArray);
        //    }
        //}


    }
}