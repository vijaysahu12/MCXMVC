using MCX.Models.DbEntities;
using MCX.Models.Tables;
using System;
using System.Data.Entity;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace MCX.Controllers
{

    //[Authorize]

    public class AccountsController : Controller
    {
        // GET: Accounts
        [AllowAnonymous]
        public ActionResult Index()
        {
            return PartialView();
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult> Login(Users obj)
        {


            using (var context = new DbEntities())
            {
                var count = await context.Users
                    .FirstOrDefaultAsync(x => x.Username == obj.Username && x.Password == obj.Password && x.IsActive && x.IsDelete == false);


                if (count != null)
                {
                    @ViewBag.msg = "Success";
                    Session["LoggedInUser"] = count;
                    AuthenticationAccess(string.Concat(count.FirstName, " ", count.LastName), true, count.LoginId, count.UserType);
                    return RedirectToAction("Index", "DashBoard");
                }
                @ViewBag.msg = "Invalid user name and password.";
                return RedirectToAction("Index", "Accounts");
            }

        }


        [NonAction]
        public void AuthenticationAccess(string EmailId, bool RememberMe, long UserId, string UserType)
        {
            FormsAuthentication.SetAuthCookie(EmailId, RememberMe);
            //string roles = "Admin,Member";
            var authTicket = new FormsAuthenticationTicket(
              1,
             EmailId,                          //user Name
              DateTime.Now,
              DateTime.Now.AddDays(1),                      // expiry in 1 day
              RememberMe,
              Convert.ToString(UserId));
            var cookie = new HttpCookie(FormsAuthentication.FormsCookieName,
                                               FormsAuthentication.Encrypt(authTicket));
            Response.Cookies.Add(cookie);
            Session["UserType"] = UserType; //_IAccount.GetUserType(UserId);

        }

        [HttpGet]
        [AllowAnonymous]
        public ActionResult LogOff()
        {
            Session.Abandon();
            FormsAuthentication.SignOut();

            return RedirectToAction("Index", "Accounts");
        }



        [Authorize]
        public async Task<ActionResult> DashBoard()
        {
            return View("Index");
        }

    }
}