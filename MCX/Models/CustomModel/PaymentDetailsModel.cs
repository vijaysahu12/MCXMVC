using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MCX.Models.CustomModel
{
    public class PaymentDetailsModel
    {
        public MCX.Models.Tables.Customers customers { get; set; }
        public List<MCX.Models.Tables.PaymentDetail> paymentDetails { get; set; }

    }
}