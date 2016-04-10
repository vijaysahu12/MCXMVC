using Microsoft.Office.Interop.Excel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MCX.HelperClass.Interface
{
    public interface IValidateEngine
    {

        bool ValidateStructure();
        void Input();
    }
}