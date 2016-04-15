using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace MCX.Tests.TestCases
{

    [TestClass]
    public class TestImportFiles
    {
        private HelperClass.Helper _fileReadObject;

        //public TestImportFiles(MCX.HelperClass.IHelper ExcelFile)
        //{
        //    _fileReadObject = ExcelFile;

        //}
        [TestInitialize]
        public void Initialise()
        {
            _fileReadObject = (HelperClass.Helper)Activator.CreateInstance(typeof(HelperClass.Helper), true);
            //_fileReadObject = ExcelFile; // TODO: Complete member initialization
        }

        [TestMethod]
        public void ReadExcelFile()
        {

            try
            {
                _fileReadObject.ReadExcelFileHelpers("E:\\Work\\Coding\\smartData\\Program\\smartData Nagpur\\Projects\\MCX\\MCX_MVC_GitHub\\MCX_Test_5April2016\\MCXFinalCode\\newSheet.xlsx");
            }
            catch (System.Runtime.InteropServices.COMException e)
            {
                throw e;
            }

        }

        [TestMethod]
        public void MultiplyTest()
        {
            if (_fileReadObject == null)
                throw new Exception("File Read Object has null value");
            _fileReadObject.Multiply(3, 4);
            Assert.AreEqual(12, 12);
        }


    }
}
