namespace MCX.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Description : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Descriptions",
                c => new
                    {
                        DescriptionID = c.Int(nullable: false, identity: true),
                        Description = c.String(),
                        CustomerID = c.Long(nullable: false),
                    })
                .PrimaryKey(t => t.DescriptionID)
                .ForeignKey("dbo.Customers", t => t.CustomerID, cascadeDelete: true)
                .Index(t => t.CustomerID);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Descriptions", "CustomerID", "dbo.Customers");
            DropIndex("dbo.Descriptions", new[] { "CustomerID" });
            DropTable("dbo.Descriptions");
        }
    }
}
