//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MCX.Models.Tables
{


    public partial class Customers
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Customers()
        {
            //this.LeadToPotentials = new HashSet<LeadToPotential>();
        }

        [Key]
        public long CustomerID { get; set; }

        [Required]
        [Display(Name = "First Name")]
        public string FirstName { get; set; }

        [Required]
        [Display(Name = "Last Name")]
        public string LastName { get; set; }

        //[Required]
        [NotMapped]
        [Display(Name = "Due Date")]
        public string DueDate { get; set; }



        public long LeadOwner { get; set; }

        [NotMapped]
        public string LeadOwnerName { get; set; }


        [NotMapped]
        public int ConvertToPotential { get; set; }

        [Required]
        [Display(Name = "Email ")]
        public string Email { get; set; }

        [Required]
        [Display(Name = "Mobile")]
        [StringLength(15, ErrorMessage = "Name cannot be longer than 15 characters.")]
        public string Mobile { get; set; }

        public string Website { get; set; }

        [Required]
        [Display(Name = "Product ")]
        public Nullable<int> ProductId { get; set; }

        public Nullable<int> LeadStatusId { get; set; }
        public Nullable<int> LeadSourceId { get; set; }
        public Nullable<int> StageId { get; set; }

        public bool IsActive { get; set; }

        [MaxLength(2)]
        public string Status { get; set; }

        //[Required]
        //[Display(Name = "Password")]
        //public string Password { get; set; }

        public bool FollowUp { get; set; }
        public string Address { get; set; }

       
        [Display(Name = "Description")]
        [DataType(DataType.MultilineText)]
        public string Description { get; set; }



        [NotMapped]
        [Display(Name = "Description")]
        [DataType(DataType.MultilineText)]
        public string NewDescription { get; set; }

        [Display(Name = "Phone")]
        [MaxLength(20)]
        public string Phone { get; set; }
       
        public string City { get; set; }
        
        public string CustomerType { get; set; }
        
        public long CreatedBy { get; set; }
        public System.DateTime CreatedDate { get; set; }
        
        public bool IsDeleted { get; set; }
        public Nullable<long> Deletedby { get; set; }
        public Nullable<long> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedDate { get; set; }
        public Nullable<long> Investmentid { get; set; }

        [Display(Name = "Lead Source")]
        public virtual LeadSources LeadSource { get; set; }


        [Display(Name = "Lead Status")]
        public virtual LeadStatu LeadStatu { get; set; }
        public virtual Users Login { get; set; }

        [Display(Name = "Product")]
        public virtual Product Product { get; set; }

        public virtual Stage Stage { get; set; }


    }
}
