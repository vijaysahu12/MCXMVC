using System;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Net;
using System.Web.Mvc;
using MCX.Models.CustomModel;
using MCX.Models.DbEntities;
using MCX.Models.Tables;

namespace MCX.Controllers
{
    public class UsersController : Controller
    {


        private readonly DbEntities _db = new DbEntities();

        // GET: Users
        public async Task<ActionResult> Index()
        {

            ViewBag.LoggedInUser = Session["LoggedInUser"];
            return View(await _db.Users.ToListAsync());
        }

        // GET: Users/Details/5
        public async Task<ActionResult> Details(long? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            var users = await _db.Users.FindAsync(id);
            if (users == null)
            {
                return HttpNotFound();
            }
            return View(users);
        }

        // GET: Users/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Users/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([Bind(Include = "LoginId,Username,Password,EmailId,Address,UserType,IsActive,Mobile")] Users users)
        {
            if (!ModelState.IsValid) return View(users);
            users.CreatedDate = DateTime.UtcNow;
            users.IsActive = true;
            users.IsDelete = false;
            users.ModifiedDate = DateTime.UtcNow;
            _db.Users.Add(users);
            await _db.SaveChangesAsync();
            return RedirectToAction("Index");
        }

        // GET: Users/Edit/5
        public async Task<ActionResult> Edit(long? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            var users = await _db.Users.FindAsync(id);
            if (users == null)
            {
                return HttpNotFound();
            }
            return View(users);
        }

        // POST: Users/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include = "LoginId,Username,Password,EmailId,Address,UserType,IsActive,IsDelete,CreatedDate,ModifiedDate,Mobile")] Users users)
        {
            if (!ModelState.IsValid) return View(users);
            _db.Entry(users).State = EntityState.Modified;
            await _db.SaveChangesAsync();
            return RedirectToAction("Index");
        }

        // GET: Users/Delete/5
        public async Task<ActionResult> Delete(long? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            var users = await _db.Users.FindAsync(id);
            if (users == null)
            {
                return HttpNotFound();
            }
            return View(users);
        }

        // POST: Users/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> DeleteConfirmed(long id)
        {
            var users = await _db.Users.FindAsync(id);
            _db.Users.Remove(users);
            await _db.SaveChangesAsync();
            return RedirectToAction("Index");
        }



        [HttpPost]
        public async Task<ActionResult> UserListForDropdown()
        {
            var users = await _db.Users.ToListAsync();


            var userList = users.Select(x => new UserDropdown
            {
                LoginId = x.LoginId,
                Username = x.Username

            }).ToList();

            return Json(userList);

        }


        [HttpPost]
        public async Task<ActionResult> UserListForDropdownForCustomerGrid()
        {
            var users = await _db.Users.ToListAsync();
            var loggedInUser = (Users)Session["LoggedInUser"];
            var userList = users.Where(x => x.LoginId != loggedInUser.LoginId).Select(x => new UserDropdown
            {
                LoginId = x.LoginId,
                Username = x.Username

            }).ToList();

            return Json(userList);

        }


        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
