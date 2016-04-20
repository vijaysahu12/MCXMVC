using System;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Net;
using System.Web.Mvc;
using System.Web.Services.Description;
using MCX.Models.DbEntities;
using MCX.Models.Tables;

namespace MCX.Controllers
{
    //[App_Start.CustomFilter]
    public class ServiceDetailsController : Controller
    {
        private readonly DbEntities _db = new DbEntities();

        // GET: ServiceDetails
        public async Task<ActionResult> Index()
        {
            return View(await _db.ServiceDetails.Include("Customers").Include("Users").OrderByDescending(x => x.ServiceEndDate).ToListAsync());
        }

        // GET: ServiceDetails/Details/5
        public async Task<ActionResult> Details(long? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            var serviceDetail = await _db.ServiceDetails.FindAsync(id);
            if (serviceDetail == null)
            {
                return HttpNotFound();
            }
            return View(serviceDetail);
        }

        // GET: ServiceDetails/Create/1
        [HttpGet]
        public ActionResult Create(long? CustomerID)
        {

            ViewBag.CustomerID = CustomerID;

            var obj = new ServiceDetail { CustomerId = Convert.ToInt32(CustomerID) };

            return View(obj);
        }

        // POST: ServiceDetails/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([Bind(Include = "PaymentID,CustomerID,Amount,Description,Active,ServiceStartDate,ServiceEndDate,isLastService,isNotified,CreatedBy,CreatedDate,ModifiedBy,ModifiedDate,DeletedBy,DeletedDate")] ServiceDetail _serviceDetail)
        {
            switch (_serviceDetail.CustomerId)
            {
                case 0:
                    ViewBag.msg = "Please select the correct user to start his service!";
                    return View();
                default:
                    {
                        var objLoggIn = (Users)Session["LoggedInUser"];

                        if (objLoggIn != null)
                        {
                            var serviceDateMisMatch = _db.ServiceDetails
                                .Count(x => (
                                    (x.ServiceStartDate <= _serviceDetail.ServiceStartDate && _serviceDetail.ServiceStartDate <= x.ServiceEndDate)
                                 || (x.ServiceEndDate <= _serviceDetail.ServiceEndDate && _serviceDetail.ServiceEndDate <= x.ServiceEndDate)
                                 || (x.ServiceStartDate >= _serviceDetail.ServiceStartDate && x.ServiceEndDate <= _serviceDetail.ServiceEndDate)) && x.Active);



                            if (serviceDateMisMatch > 0)
                            {
                                var message = ("This user already has one service between " + _serviceDetail.ServiceStartDate.ToShortDateString() + " and " + _serviceDetail.ServiceEndDate.ToShortDateString());
                                TempData["Message"] = message;
                                return View("Create", _serviceDetail);
                            }
                            else
                            {
                                _serviceDetail.CreatedDate = DateTime.Now;
                                _serviceDetail.Active = true;
                                _serviceDetail.IsLastService = true;
                                _serviceDetail.IsNotified = false;
                                _serviceDetail.CreatedBy = objLoggIn.LoginId;


                                if (ModelState.IsValid)
                                {
                                    _db.ServiceDetails.Add(_serviceDetail);
                                    await _db.SaveChangesAsync();
                                    return View("Create");
                                }
                            }
                        }
                        else
                        {
                            return RedirectToActionPermanent("Index", "Accounts");
                        }
                    }
                    break;
            }
            return RedirectToAction("Index");
        }

        // GET: ServiceDetails/Edit/5
        public async Task<ActionResult> Edit(long? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            ServiceDetail serviceDetail = await _db.ServiceDetails.FindAsync(id);
            if (serviceDetail == null)
            {
                return HttpNotFound();
            }
            return View(serviceDetail);
        }

        // POST: ServiceDetails/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include = "PaymentID,CustomerID,Amount,Description,Active,ServiceStartDate,ServiceEndDate,isLastService,isNotified,CreatedBy,CreatedDate,ModifiedBy,ModifiedDate,DeletedBy,DeletedDate")] ServiceDetail serviceDetail)
        {
            if (ModelState.IsValid)
            {
                _db.Entry(serviceDetail).State = EntityState.Modified;
                await _db.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            return View(serviceDetail);
        }

        // GET: ServiceDetails/Delete/5
        public async Task<ActionResult> Delete(long? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            ServiceDetail serviceDetail = await _db.ServiceDetails.FindAsync(id);
            if (serviceDetail == null)
            {
                return HttpNotFound();
            }
            return View(serviceDetail);
        }

        // POST: ServiceDetails/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> DeleteConfirmed(long id)
        {
            ServiceDetail serviceDetail = await _db.ServiceDetails.FindAsync(id);
            _db.ServiceDetails.Remove(serviceDetail);
            await _db.SaveChangesAsync();
            return RedirectToAction("Index");
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
