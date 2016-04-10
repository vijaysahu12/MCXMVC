using MCX.HelperClass.Class;
using MCX.Models.Tables;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MCX.Tests.TestCases
{
    [TestClass]
    public class DataTableToListTest
    {
        [TestMethod]
        public void DataTableToListTestMethod()
        {
            var list = DataTableToListHelper.DataTableToList<Customers>(new DataTable());
        }
    }
}
