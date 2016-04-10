namespace MCX.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class PaymentDetail : DbMigration
    {
        public override void Up()
        {
            CreateIndex("dbo.PaymentDetails", "CustomerID");
            AddForeignKey("dbo.PaymentDetails", "CustomerID", "dbo.Customers", "CustomerID", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.PaymentDetails", "CustomerID", "dbo.Customers");
            DropIndex("dbo.PaymentDetails", new[] { "CustomerID" });
        }
    }
}
