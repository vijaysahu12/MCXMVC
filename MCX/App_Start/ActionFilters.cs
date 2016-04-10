using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MCX.App_Start
{
    public class ActionFilters
    {
    }

    public class SessionExpireAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            HttpContext ctx = HttpContext.Current;
            // check  sessions here
            if (HttpContext.Current.Session["LoggedInUser"] == null)
            {
                filterContext.Result = new RedirectResult("~/Accounts/Index");
                return;
            }
            base.OnActionExecuting(filterContext);
        }
    }
}