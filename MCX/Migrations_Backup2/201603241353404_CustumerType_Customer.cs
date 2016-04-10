namespace MCX.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CustumerType_Customer : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Customers", "CustomerType", c => c.String());
            DropColumn("dbo.Customers", "UserType");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Customers", "UserType", c => c.String());
            DropColumn("dbo.Customers", "CustomerType");
        }
    }
}
