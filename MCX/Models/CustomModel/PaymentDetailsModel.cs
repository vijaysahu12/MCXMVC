using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MCX.Models.CustomModel
{
    public class ServiceDetailsModel
    {
        public MCX.Models.Tables.Customers Customers { get; set; }
        public List<MCX.Models.Tables.ServiceDetail> ServiceDetails { get; set; }

    }
}