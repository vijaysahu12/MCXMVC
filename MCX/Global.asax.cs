﻿using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;

namespace MCX
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);

            //Database.SetInitializer<DbContext>(new DefaultValuesInitializer());

        }

        //protected void Session_End(object sender, EventArgs e)
        //{
        //    Response.Redirect("~/Accounts/Index");
        //}
    }
}