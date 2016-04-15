using MCX.Models.DbEntities;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Data;
using System.Data.Entity;
using System.Net;
namespace MCX.Controllers
{
    public class PotentialsController : Controller
    {
        //
        // GET: /Potentials/
        private readonly DbEntities db = new DbEntities();
        public async Task<ActionResult> Index(string sortOrder, string currentFilter, string searchString, int? page)
        {
            var count = 0;
            var customers = db.Customers.Where(x => x.CustomerType == "P").Include(c => c.LeadSource).Include(c => c.LeadStatu).Include(c => c.Product).Include(c => c.Stage);
            count = customers.Count();
            if (!String.IsNullOrEmpty(searchString))
            {
                customers = customers.Where(s => s.LastName.Contains(searchString) || s.FirstName.Contains(searchString)
                || s.Email.Contains(searchString));
            }
            switch (sortOrder)
            {
                case "name_desc":
                    customers = customers.OrderByDescending(s => s.FirstName);
                    break;
                case "Date":
                    customers = customers.OrderBy(s => s.CreatedDate);
                    break;
                case "date_desc":
                    customers = customers.OrderByDescending(s => s.CreatedDate);
                    break;
                default:  // Name ascending 
                    customers = customers.OrderBy(s => s.LastName);
                    break;
            }

            count = customers.Count();

            return View(await customers.ToListAsync());
        }



        // GET: Customers/Details/5
        public async Task<ActionResult> Details(long? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }

            var pdObject = new Models.CustomModel.PaymentDetailsModel();
            pdObject.customers = await db.Customers.FindAsync(id);

            pdObject.paymentDetails = await db.PaymentDetails.Where(x => x.CustomerID == id).ToListAsync();

            if (pdObject.customers == null)
            {
                return HttpNotFound();
            }
            return View(pdObject);
        }
    }
}
