using System;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Net;
using System.Web.Mvc;
using MCX.Models.DbEntities;
using MCX.Models.Tables;

namespace MCX.Controllers
{
    //[App_Start.CustomFilter]
    public class PaymentDetailsController : Controller
    {
        private readonly DbEntities _db = new DbEntities();

        // GET: PaymentDetails
        public async Task<ActionResult> Index()
        {
            return View(await _db.PaymentDetails.Include("Customers").Include("Users").OrderByDescending(x => x.ServiceEndDate).ToListAsync());
        }

        // GET: PaymentDetails/Details/5
        public async Task<ActionResult> Details(long? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            var paymentDetail = await _db.PaymentDetails.FindAsync(id);
            if (paymentDetail == null)
            {
                return HttpNotFound();
            }
            return View(paymentDetail);
        }

        // GET: PaymentDetails/Create/1
        [HttpGet]
        public ActionResult Create(long? CustomerID)
        {

            ViewBag.CustomerID = CustomerID;

            var obj = new PaymentDetail { CustomerId = Convert.ToInt32(CustomerID) };

            return View(obj);
        }

        // POST: PaymentDetails/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([Bind(Include = "PaymentID,CustomerID,Amount,Description,Active,ServiceStartDate,ServiceEndDate,isLastService,isNotified,CreatedBy,CreatedDate,ModifiedBy,ModifiedDate,DeletedBy,DeletedDate")] PaymentDetail paymentDetail)
        {
            switch (paymentDetail.CustomerId)
            {
                case 0:
                    ViewBag.msg = "For whom you want to start this service!";
                    return View();
                default:
                    {
                        var objLoggIn = (Users)Session["LoggedInUser"];

                        if (objLoggIn != null)
                        {
                            paymentDetail.CreatedDate = DateTime.Now;
                            paymentDetail.Active = true;
                            paymentDetail.IsLastService = true;
                            paymentDetail.IsNotified = false;
                            paymentDetail.CreatedBy = objLoggIn.LoginId;

                            if (ModelState.IsValid)
                            {

                                //var abc = db.Customers.Where(x => x.CustomerID == paymentDetail.CustomerID).FirstOrDefault();
                                //abc.UserType = "P";
                             
                                _db.PaymentDetails.Add(paymentDetail);
                                await _db.SaveChangesAsync();
                                //await db.SaveChangesAsync();

                                //db.Entry(abc).State = EntityState.Modified;
                                //await db.SaveChangesAsync();
                                return RedirectToAction("Index");
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

        // GET: PaymentDetails/Edit/5
        public async Task<ActionResult> Edit(long? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            PaymentDetail paymentDetail = await _db.PaymentDetails.FindAsync(id);
            if (paymentDetail == null)
            {
                return HttpNotFound();
            }
            return View(paymentDetail);
        }

        // POST: PaymentDetails/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include = "PaymentID,CustomerID,Amount,Description,Active,ServiceStartDate,ServiceEndDate,isLastService,isNotified,CreatedBy,CreatedDate,ModifiedBy,ModifiedDate,DeletedBy,DeletedDate")] PaymentDetail paymentDetail)
        {
            if (ModelState.IsValid)
            {
                _db.Entry(paymentDetail).State = EntityState.Modified;
                await _db.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            return View(paymentDetail);
        }

        // GET: PaymentDetails/Delete/5
        public async Task<ActionResult> Delete(long? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            PaymentDetail paymentDetail = await _db.PaymentDetails.FindAsync(id);
            if (paymentDetail == null)
            {
                return HttpNotFound();
            }
            return View(paymentDetail);
        }

        // POST: PaymentDetails/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> DeleteConfirmed(long id)
        {
            PaymentDetail paymentDetail = await _db.PaymentDetails.FindAsync(id);
            _db.PaymentDetails.Remove(paymentDetail);
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
