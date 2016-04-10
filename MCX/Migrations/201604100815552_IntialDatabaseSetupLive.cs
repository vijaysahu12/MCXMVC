namespace MCX.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class IntialDatabaseSetupLive : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Customers",
                c => new
                    {
                        CustomerID = c.Long(nullable: false, identity: true),
                        FirstName = c.String(nullable: false),
                        LastName = c.String(nullable: false),
                        LeadOwner = c.Long(nullable: false),
                        Email = c.String(nullable: false),
                        Mobile = c.String(nullable: false, maxLength: 15),
                        Website = c.String(),
                        ProductId = c.Int(nullable: false),
                        LeadStatusId = c.Int(),
                        LeadSourceId = c.Int(),
                        StageId = c.Int(),
                        IsActive = c.Boolean(nullable: false),
                        Status = c.String(maxLength: 2),
                        FollowUp = c.Boolean(nullable: false),
                        Address = c.String(),
                        Description = c.String(),
                        Phone = c.String(maxLength: 20),
                        City = c.String(),
                        CustomerType = c.String(),
                        CreatedBy = c.Long(nullable: false),
                        CreatedDate = c.DateTime(nullable: false),
                        IsDeleted = c.Boolean(nullable: false),
                        Deletedby = c.Long(),
                        ModifiedBy = c.Long(),
                        ModifiedDate = c.DateTime(),
                        Investmentid = c.Long(),
                        Login_LoginId = c.Long(),
                    })
                .PrimaryKey(t => t.CustomerID)
                .ForeignKey("dbo.LeadSources", t => t.LeadSourceId)
                .ForeignKey("dbo.LeadStatus", t => t.LeadStatusId)
                .ForeignKey("dbo.Users", t => t.Login_LoginId)
                .ForeignKey("dbo.Products", t => t.ProductId, cascadeDelete: true)
                .ForeignKey("dbo.Stages", t => t.StageId)
                .Index(t => t.ProductId)
                .Index(t => t.LeadStatusId)
                .Index(t => t.LeadSourceId)
                .Index(t => t.StageId)
                .Index(t => t.Login_LoginId);
            
            CreateTable(
                "dbo.LeadSources",
                c => new
                    {
                        LeadSourceID = c.Int(nullable: false, identity: true),
                        SourceName = c.String(),
                    })
                .PrimaryKey(t => t.LeadSourceID);
            
            CreateTable(
                "dbo.LeadStatus",
                c => new
                    {
                        LeadStatusId = c.Int(nullable: false, identity: true),
                        LeadStatus = c.String(),
                    })
                .PrimaryKey(t => t.LeadStatusId);
            
            CreateTable(
                "dbo.Users",
                c => new
                    {
                        LoginId = c.Long(nullable: false, identity: true),
                        Username = c.String(nullable: false),
                        FirstName = c.String(),
                        LastName = c.String(),
                        Password = c.String(nullable: false),
                        EmailId = c.String(nullable: false),
                        Mobile = c.String(nullable: false, maxLength: 15),
                        Address = c.String(nullable: false),
                        UserType = c.String(),
                        IsActive = c.Boolean(nullable: false),
                        IsDelete = c.Boolean(nullable: false),
                        CreatedDate = c.DateTime(nullable: false),
                        ModifiedDate = c.DateTime(),
                    })
                .PrimaryKey(t => t.LoginId);
            
            CreateTable(
                "dbo.Products",
                c => new
                    {
                        ProductId = c.Int(nullable: false, identity: true),
                        ProductName = c.String(),
                    })
                .PrimaryKey(t => t.ProductId);
            
            CreateTable(
                "dbo.Stages",
                c => new
                    {
                        StageId = c.Int(nullable: false, identity: true),
                        StageName = c.String(),
                    })
                .PrimaryKey(t => t.StageId);
            
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
            
            CreateTable(
                "dbo.PaymentDetails",
                c => new
                    {
                        PaymentID = c.Long(nullable: false, identity: true),
                        CustomerID = c.Long(nullable: false),
                        ServiceType = c.Int(nullable: false),
                        Amount = c.Double(nullable: false),
                        Description = c.String(nullable: false),
                        Active = c.Boolean(nullable: false),
                        ServiceStartDate = c.DateTime(nullable: false),
                        ServiceEndDate = c.DateTime(nullable: false),
                        isLastService = c.Boolean(nullable: false),
                        isNotified = c.Boolean(nullable: false),
                        CreatedBy = c.Long(nullable: false),
                        CreatedDate = c.DateTime(nullable: false),
                        ModifiedBy = c.Long(),
                        ModifiedDate = c.DateTime(),
                        DeletedBy = c.Long(),
                        DeletedDate = c.DateTime(),
                    })
                .PrimaryKey(t => t.PaymentID)
                .ForeignKey("dbo.Customers", t => t.CustomerID, cascadeDelete: true)
                .ForeignKey("dbo.Users", t => t.CreatedBy, cascadeDelete: true)
                .Index(t => t.CustomerID)
                .Index(t => t.CreatedBy);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.PaymentDetails", "CreatedBy", "dbo.Users");
            DropForeignKey("dbo.PaymentDetails", "CustomerID", "dbo.Customers");
            DropForeignKey("dbo.Descriptions", "CustomerID", "dbo.Customers");
            DropForeignKey("dbo.Customers", "StageId", "dbo.Stages");
            DropForeignKey("dbo.Customers", "ProductId", "dbo.Products");
            DropForeignKey("dbo.Customers", "Login_LoginId", "dbo.Users");
            DropForeignKey("dbo.Customers", "LeadStatusId", "dbo.LeadStatus");
            DropForeignKey("dbo.Customers", "LeadSourceId", "dbo.LeadSources");
            DropIndex("dbo.PaymentDetails", new[] { "CreatedBy" });
            DropIndex("dbo.PaymentDetails", new[] { "CustomerID" });
            DropIndex("dbo.Descriptions", new[] { "CustomerID" });
            DropIndex("dbo.Customers", new[] { "Login_LoginId" });
            DropIndex("dbo.Customers", new[] { "StageId" });
            DropIndex("dbo.Customers", new[] { "LeadSourceId" });
            DropIndex("dbo.Customers", new[] { "LeadStatusId" });
            DropIndex("dbo.Customers", new[] { "ProductId" });
            DropTable("dbo.PaymentDetails");
            DropTable("dbo.Descriptions");
            DropTable("dbo.Stages");
            DropTable("dbo.Products");
            DropTable("dbo.Users");
            DropTable("dbo.LeadStatus");
            DropTable("dbo.LeadSources");
            DropTable("dbo.Customers");
        }
    }
}
