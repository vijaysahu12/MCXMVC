namespace MCX.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class customer_tables_ValidationUpdate : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Customers", "Description", c => c.String());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Customers", "Description", c => c.String(nullable: false));
        }
    }
}
