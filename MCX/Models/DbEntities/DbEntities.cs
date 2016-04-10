using MCX.Models.Tables;
using System.Data.Entity;

namespace MCX.Models.DbEntities
{
    public class DbEntities : DbContext
    {

        public DbEntities() : base("name=MCX")
        {

        }
        public DbSet<Users> Users { get; set; }

        public System.Data.Entity.DbSet<MCX.Models.Tables.Customers> Customers { get; set; }

        public System.Data.Entity.DbSet<MCX.Models.Tables.LeadStatu> LeadStatus { get; set; }

        public System.Data.Entity.DbSet<MCX.Models.Tables.Product> Products { get; set; }

        public System.Data.Entity.DbSet<MCX.Models.Tables.Stage> Stages { get; set; }

        public System.Data.Entity.DbSet<MCX.Models.Tables.LeadSources> LeadSources { get; set; }


        public System.Data.Entity.DbSet<MCX.Models.Tables.PaymentDetail> PaymentDetails { get; set; }

        public System.Data.Entity.DbSet<MCX.Models.Tables.Descriptions> Descriptions { get; set; }



        //public DbSet<Login> Logins { get; set; }
    }
}