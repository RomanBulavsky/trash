namespace PL.MVC.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class by : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.ApplicationUserApplicationRoles",
                c => new
                    {
                        ApplicationUser_Id = c.String(nullable: false, maxLength: 128),
                        ApplicationRole_Id = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.ApplicationUser_Id, t.ApplicationRole_Id })
                .ForeignKey("dbo.AspNetUsers", t => t.ApplicationUser_Id, cascadeDelete: true)
                .ForeignKey("dbo.AspNetRoles", t => t.ApplicationRole_Id, cascadeDelete: true)
                .Index(t => t.ApplicationUser_Id)
                .Index(t => t.ApplicationRole_Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.ApplicationUserApplicationRoles", "ApplicationRole_Id", "dbo.AspNetRoles");
            DropForeignKey("dbo.ApplicationUserApplicationRoles", "ApplicationUser_Id", "dbo.AspNetUsers");
            DropIndex("dbo.ApplicationUserApplicationRoles", new[] { "ApplicationRole_Id" });
            DropIndex("dbo.ApplicationUserApplicationRoles", new[] { "ApplicationUser_Id" });
            DropTable("dbo.ApplicationUserApplicationRoles");
        }
    }
}
