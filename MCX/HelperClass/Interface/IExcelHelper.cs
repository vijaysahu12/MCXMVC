using MCX.Models.Tables;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MCX.HelperClass.Interface
{
    public interface IExceReaderlHelper
    {
        List<Customers> readExcelFile(string path);
        string readExcelFile(string path, string transactionType);
        void readExcelFileHelpers(string path);
        int multiply(int a, int b);
        DataTable readExcelFileToDT(string fileName);
    }


}
