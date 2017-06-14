using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(PL.MVC.Startup))]
namespace PL.MVC
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
