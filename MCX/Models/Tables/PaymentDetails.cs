using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace MCX.Models.Tables
{
    public class ServiceDetail
    {
        [Key]
        public long PaymentId { get; set; }

        [Required]
        public long CustomerId { get; set; }

        [ForeignKey("CustomerId")]
        public virtual Customers Customers { get; set; }

        public int ServiceType { get; set; }

        [Required]
        [DataType(DataType.Currency)]
        public double? Amount { get; set; }

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
        public bool IsLastService { get; set; }

        [DefaultValue(false)]
        public bool IsNotified { get; set; }

        [Required]
        public long CreatedBy { get; set; }

        [ForeignKey("CreatedBy")]
        public virtual Users Users { get; set; }

        [Required]
        public DateTime CreatedDate { get; set; }

        public Nullable<long> ModifiedBy { get; set; }

        public Nullable<DateTime> ModifiedDate { get; set; }

        public Nullable<long> DeletedBy { get; set; }

        public Nullable<DateTime> DeletedDate { get; set; }
    }
}