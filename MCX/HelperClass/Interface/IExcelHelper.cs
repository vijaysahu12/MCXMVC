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
        List<Customers> ReadExcelFile(string path);
        string ReadExcelFile(string path, string transactionType);
        void ReadExcelFileHelpers(string path);
        int Multiply(int a, int b);
        DataTable ReadExcelFileToDt(string fileName);
    }


}
