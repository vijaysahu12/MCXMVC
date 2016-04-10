namespace MCX.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addServiceType : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.PaymentDetails", "ServiceType", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.PaymentDetails", "ServiceType");
        }
    }
}
