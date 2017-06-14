using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading.Tasks;
using System.Web;
using System.Web.Security;
using Microsoft.ApplicationInsights.Extensibility.Implementation;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;

namespace PL.MVC.Models
{
    // You can add profile data for the user by adding more properties to your ApplicationUser class, please visit https://go.microsoft.com/fwlink/?LinkID=317594 to learn more.
    public class ApplicationUser : IdentityUser
    {
        public virtual ICollection<ApplicationRole> UserRoles { get; set; }

        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<ApplicationUser> manager)
        {
            // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
            var userIdentity = await manager.CreateIdentityAsync(this, DefaultAuthenticationTypes.ApplicationCookie);
            // Add custom user claims here
            return userIdentity;
        }
    }
    public class ApplicationRole : IdentityRole

    {
        public virtual ICollection<ApplicationUser> RoleUsers { get; set; }

        public ApplicationRole() : base() { }

        public ApplicationRole(string name) : base(name) { }

        public string Description { get; set; }

    }

    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext()
            : base("DefaultConnection", throwIfV1Schema: false)
        {
            Database.SetInitializer<ApplicationDbContext>(new ApplicationDbInitializer());
        }

        //public DbSet<ApplicationUser> RoleUsers { get; set; }

        //public DbSet<ApplicationRole> UserRoles { get; set; }

        public static ApplicationDbContext Create()
        {
            return new ApplicationDbContext();
        }
    }
    public class ApplicationDbInitializer
    : DropCreateDatabaseIfModelChanges<ApplicationDbContext>
    {
        protected override void Seed(ApplicationDbContext context)
        {
            InitializeIdentityForEF(context);
            base.Seed(context);
        }
        public static void InitializeIdentityForEF(ApplicationDbContext db)
        {
            var userManager =
                HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>();
            var roleManager =
                HttpContext.Current.GetOwinContext().Get<ApplicationRoleManager>();
            const string name = "admin@admin.com";
            const string password = "123654987aA!";
            const string roleName = "Admin";
            const string name2 = "admin2@admin.com";
            const string password2 = "123654987aA!";
            const string roleName2 = "user";

            GetValue(roleManager, roleName, userManager, name, password);

            GetValue(roleManager, roleName2, userManager, name2, password2);
        }

        private static void GetValue(ApplicationRoleManager roleManager, string roleName, ApplicationUserManager userManager,
            string name, string password)
        {
//Create Role Admin if it does not exist
            var role = roleManager.FindByName(roleName);
            if (role == null)
            {
                role = new ApplicationRole(roleName);
                var roleresult = roleManager.Create(role);
            }

            var user = userManager.FindByName(name);
            if (user == null)
            {
                user = new ApplicationUser {UserName = name, Email = name};
                var result = userManager.Create(user, password);
                result = userManager.SetLockoutEnabled(user.Id, false);
            }

            // Add user admin to Role Admin if not already added
            var rolesForUser = userManager.GetRoles(user.Id);
            if (!rolesForUser.Contains(role.Name))
            {
                var result = userManager.AddToRole(user.Id, role.Name);
            }
        }
    }
    public class AppRoleProvider : RoleProvider
    {
        public override string[] GetAllRoles()
        {
            using (var userContext = new ApplicationDbContext())
            {
                return userContext.Roles.Select(r => r.Name).ToArray();
            }
        }

        public override string[] GetRolesForUser(string username)
        {
            
            using (var userContext = new ApplicationDbContext())
            {
                var user = userContext.Users.SingleOrDefault(u => u.UserName == username);
                var ur = user.Roles.Where(x=>x.UserId == user.Id).ToList();
                string[] userRoles = new string[] {};
                foreach (var identityUserRole in ur)
                {
                    userRoles = userContext.Roles.Where(x => x.Id == identityUserRole.RoleId ).Select(r => r.Name).ToArray();
                    
                }
                
                if (user == null)
                    return new string[] { };
                return user.Roles == null ? new string[] { } :
                    userRoles;
            }
        }

        public override bool IsUserInRole(string username, string roleName)
        {
            throw new System.NotImplementedException();
        }

        public override void CreateRole(string roleName)
        {
            throw new System.NotImplementedException();
        }

        public override bool DeleteRole(string roleName, bool throwOnPopulatedRole)
        {
            throw new System.NotImplementedException();
        }

        public override bool RoleExists(string roleName)
        {
            throw new System.NotImplementedException();
        }

        public override void AddUsersToRoles(string[] usernames, string[] roleNames)
        {
            var userManager =
                HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>();
            var roleManager =
                HttpContext.Current.GetOwinContext().Get<ApplicationRoleManager>();

            using (var dbContext = new ApplicationDbContext())
            {
                var dbRoles = dbContext.Roles.ToList();
                var dbUsers = dbContext.Users.ToList();
                foreach (var rolename in roleNames)
                {
                    var role = dbContext.Roles.First(x => x.Name == rolename);

                    foreach (var username in usernames)
                    {
                        var user = dbContext.Users.First(x => x.UserName == username);
                        userManager.AddToRole(user.Id, role.Name);
                        //role.Users.Add(new IdentityUserRole() {RoleId = role.Id,UserId = user.Id});
                    }
                        
                }
                //dbContext.SaveChanges();
            }
        }

        public override void RemoveUsersFromRoles(string[] usernames, string[] roleNames)
        {

            var userManager =
                HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>();
            var roleManager =
                HttpContext.Current.GetOwinContext().Get<ApplicationRoleManager>();

            using (var dbContext = new ApplicationDbContext())
            {
                var dbRoles = dbContext.Roles.ToList();
                var dbUsers = dbContext.Users.ToList();
                foreach (var rolename in roleNames)
                {
                    var role = dbContext.Roles.First(x => x.Name == rolename);

                    foreach (var username in usernames)
                    {
                        var user = dbContext.Users.First(x => x.UserName == username);
                        userManager.RemoveFromRole(user.Id, role.Name);
                        //role.Users.Remove(new IdentityUserRole() { RoleId = role.Id, UserId = user.Id });
                    }

                }
                //dbContext.SaveChanges();
            }
        }

        public override string[] GetUsersInRole(string roleName)
        {
            throw new System.NotImplementedException();
        }

        public override string[] FindUsersInRole(string roleName, string usernameToMatch)
        {
            throw new System.NotImplementedException();
        }

        public override string ApplicationName { get; set; }
  
    }
}