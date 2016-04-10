using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MCX.Tests
{

    [TestClass]
    public class TestImportFiles
    {
        private MCX.HelperClass.Helper _fileReadObject;

        //public TestImportFiles(MCX.HelperClass.IHelper ExcelFile)
        //{
        //    _fileReadObject = ExcelFile;

        //}
        [TestInitialize]
        public void Initialise()
        {
            _fileReadObject = (MCX.HelperClass.Helper)Activator.CreateInstance(typeof(MCX.HelperClass.Helper), true);
            //_fileReadObject = ExcelFile; // TODO: Complete member initialization
        }

        [TestMethod]
        public void ReadExcelFile()
        {

            try
            {
                _fileReadObject.readExcelFileHelpers("E:\\Work\\Coding\\smartData\\Program\\smartData Nagpur\\Projects\\MCX\\MCX_MVC_GitHub\\MCX_Test_5April2016\\MCXFinalCode\\newSheet.xlsx");
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
            _fileReadObject.multiply(3, 4);
            Assert.AreEqual(12, 12);
        }


    }
}
