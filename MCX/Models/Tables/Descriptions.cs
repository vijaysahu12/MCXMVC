using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MCX.Models.Tables
{
    public class Descriptions
    {
        [Key]
        public int DescriptionID { get; set; }


        [DataType(DataType.MultilineText)]
        public string Description { get; set; }


        [Required]
        public long CustomerID { get; set; }


        //[System.ComponentModel.DataAnnotations.Schema.ForeignKey("CustomerID")]
        public virtual Customers Customers { get; set; }
    }
}