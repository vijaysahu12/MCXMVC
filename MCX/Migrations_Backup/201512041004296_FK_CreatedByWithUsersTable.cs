namespace MCX.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class FK_CreatedByWithUsersTable : DbMigration
    {
        public override void Up()
        {
            CreateIndex("dbo.PaymentDetails", "CreatedBy");
            AddForeignKey("dbo.PaymentDetails", "CreatedBy", "dbo.Users", "LoginId", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.PaymentDetails", "CreatedBy", "dbo.Users");
            DropIndex("dbo.PaymentDetails", new[] { "CreatedBy" });
        }
    }
}
