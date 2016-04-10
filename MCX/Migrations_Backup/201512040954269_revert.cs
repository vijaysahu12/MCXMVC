namespace MCX.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class revert : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.PaymentDetails", "CustomerID", "dbo.Customers");
            DropIndex("dbo.PaymentDetails", new[] { "CustomerID" });
        }
        
        public override void Down()
        {
            CreateIndex("dbo.PaymentDetails", "CustomerID");
            AddForeignKey("dbo.PaymentDetails", "CustomerID", "dbo.Customers", "CustomerID", cascadeDelete: true);
        }
    }
}
