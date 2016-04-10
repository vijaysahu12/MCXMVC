using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Net;
using System.Web;
using System.Web.Mvc;
using MCX.Models.DbEntities;
using MCX.Models.Tables;

namespace MCX.Controllers
{
    //[App_Start.CustomFilter]
    public class PaymentDetailsController : Controller
    {
        private DbEntities db = new DbEntities();

        // GET: PaymentDetails
        public async Task<ActionResult> Index()
        {
            return View(await db.PaymentDetails.Include("Customers").Include("Users").OrderByDescending(x=>x.ServiceEndDate).ToListAsync());
        }

        // GET: PaymentDetails/Details/5
        public async Task<ActionResult> Details(long? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            PaymentDetail paymentDetail = await db.PaymentDetails.FindAsync(id);
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

            PaymentDetail Obj = new PaymentDetail();
            Obj.CustomerID = Convert.ToInt32(CustomerID);

            return View(Obj);
        }

        // POST: PaymentDetails/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([Bind(Include = "PaymentID,CustomerID,Amount,Description,Active,ServiceStartDate,ServiceEndDate,isLastService,isNotified,CreatedBy,CreatedDate,ModifiedBy,ModifiedDate,DeletedBy,DeletedDate")] PaymentDetail paymentDetail)
        {
            if (paymentDetail.CustomerID == 0)
            {
                ViewBag.msg = "For whom you want to start this service!";
                return View();

            }
            else
            {
                Users objLoggIn = (Users)Session["LoggedInUser"];

                if (objLoggIn != null)
                {
                    paymentDetail.CreatedDate = DateTime.Now;
                    paymentDetail.Active = true;
                    paymentDetail.isLastService = true;
                    paymentDetail.isNotified = false;
                    paymentDetail.CreatedBy = objLoggIn.LoginId;

                    if (ModelState.IsValid)
                    {
                        
                        //var abc = db.Customers.Where(x => x.CustomerID == paymentDetail.CustomerID).FirstOrDefault();
                        //abc.UserType = "P";
                        await db.SaveChangesAsync();
                        try
                        {

                            db.PaymentDetails.Add(paymentDetail);
                            //await db.SaveChangesAsync();

                            //db.Entry(abc).State = EntityState.Modified;
                            //await db.SaveChangesAsync();
                        }
                        catch (Exception)
                        {
                            throw;
                        }
                        return RedirectToAction("Index");
                    }
                }
                else
                {
                    return RedirectToActionPermanent("Index", "Accounts");
                }
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
            PaymentDetail paymentDetail = await db.PaymentDetails.FindAsync(id);
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
                db.Entry(paymentDetail).State = EntityState.Modified;
                await db.SaveChangesAsync();
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
            PaymentDetail paymentDetail = await db.PaymentDetails.FindAsync(id);
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
            PaymentDetail paymentDetail = await db.PaymentDetails.FindAsync(id);
            db.PaymentDetails.Remove(paymentDetail);
            await db.SaveChangesAsync();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
