using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(ToDoListApplication.Startup))]
namespace ToDoListApplication
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
