using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MCX.Models.Tables
{
    public class PaymentDetail
    {
        [Key]
        public long PaymentID { get; set; }

        [Required]
        public long CustomerID { get; set; }

        //[System.ComponentModel.DataAnnotations.Schema.ForeignKey("CustomerID")]
        public virtual Customers Customers { get; set; }

        public int ServiceType { get; set; }

        [System.ComponentModel.DataAnnotations.Schema.ForeignKey("CreatedBy")]
        public virtual Users Users { get; set; }

        [Required]
        [DataType(DataType.Currency)]
        public Nullable<double> Amount { get; set; }

        [Required]
        [DataType(DataType.MultilineText)]
        public string Description { get; set; }

        [DefaultValue(false)]
        public bool Active { get; set; }

        [Required]
        [DataType(DataType.DateTime)]
        public DateTime ServiceStartDate { get; set; }

        [Required]
        [DataType(DataType.DateTime)]
        public DateTime ServiceEndDate { get; set; }

        [DefaultValue(false)]
        public bool isLastService { get; set; }

        [DefaultValue(false)]
        public bool isNotified { get; set; }

        public long CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; }

        public Nullable<long> ModifiedBy { get; set; }

        public Nullable<DateTime> ModifiedDate { get; set; }

        public Nullable<long> DeletedBy { get; set; }

        public Nullable<DateTime> DeletedDate { get; set; }
    }
}