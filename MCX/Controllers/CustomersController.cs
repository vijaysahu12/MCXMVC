﻿using System;
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
using System.IO;
using MCX.HelperClass;

namespace MCX.Controllers
{
    // [Authorize]

    [MCX.App_Start.SessionExpire]
    public class CustomersController : Controller
    {
        private DbEntities db = new DbEntities();
        private readonly MCX.HelperClass.Helper _Helper;

        public CustomersController()
        {
            _Helper = (MCX.HelperClass.Helper)Activator.CreateInstance(typeof(MCX.HelperClass.Helper), true);
        }
        //public CustomersController(MCX.HelperClass.Helper _helperRef)
        //{
        //    _Helper = _helperRef;
        //}

        public ActionResult ImportLeadAndPotential()
        {
            try
            {
                HttpPostedFileBase file = Request.Files["anyFileType"];
                if (file != null && file.ContentLength > 0)
                {
                    var allowedExtensions = new[] { ".xls", ".xlsx" }; // ".xls", ".xlsx", ".xml",
                    var extension = Path.GetExtension(file.FileName);
                    if (!allowedExtensions.Contains(extension))
                    {
                        string result = "FileTypeNotAllowed";
                    }
                    else
                    {
                        var fileName = Path.GetFileName(file.FileName);
                        string filepath = Server.MapPath("~/saveFile/") + DateTime.Now.ToString("MM-dd-yyyy") + "_" + Guid.NewGuid() + "_" + fileName;
                        file.SaveAs(filepath);

                        //string lineToWrite = null;
                        using (StreamReader reader = new StreamReader(filepath))
                        {
                            //lineToWrite = reader.ReadLine();
                            //string objCustomerListNew = _Helper.readExcelFile(filepath, "dsf");
                            //List<Customers> objCustomerList = _Helper.readExcelFile(filepath);
                            DataTable dt = null;
                            if (filepath != null)
                            {
                                switch (file.FileName.ToString().Split('.')[1].ToString())
                                {
                                    case "xls":
                                        //tt = SaveExcelFile(objCustomerList);
                                        break;
                                    case "xlsx":
                                        dt = new DataTable();

                                        dt = _Helper.readExcelFileToDT(filepath);//"D:\\Book1.xlsx"

                                        var list = MCX.HelperClass.Class.DataTableToListHelper.DataTableToList<Customers>(dt);
                                        try
                                        {





                                            if (list != null)
                                            {
                                                var LoggedInUser = (Users)Session["LoggedInUser"];
                                                list.ForEach((Customers) =>
                                                {

                                                    Customers.CreatedBy = LoggedInUser.LoginId;
                                                    Customers.CreatedDate = DateTime.Now;
                                                    Customers.CustomerType = "L";
                                                    Customers.DueDate = DateTime.Now.AddDays(2).ToShortDateString();
                                                    Customers.FollowUp = false;
                                                    Customers.Investmentid = 0;
                                                    Customers.LeadOwner = LoggedInUser.LoginId;
                                                    Customers.LeadSourceId = 2;
                                                    Customers.LeadStatusId = 4;
                                                    Customers.ProductId = 1;
                                                    Customers.StageId = 1;

                                                    db.Customers.Add(Customers);
                                                    db.SaveChanges();
                                                });

                                                //foreach (var a in list)
                                                //{
                                                //    db.Customers.Add(a);
                                                //}
                                                //db.SaveChanges();
                                            }
                                        }
                                        catch (Exception)
                                        {

                                            throw new Exception("Validation faild!");
                                        }
                                        //tt = SaveExcelFile(objCustomerList);
                                        break;
                                    default:
                                        {
                                            ViewBag.errorMessage = "Please select 'CSV' file type for importing customer details.";
                                        }
                                        break;
                                }
                            }
                        }
                    }
                }

            }
            catch (Exception ex)
            {

            }

            return View("Index");
        }

        [NonAction]
        bool SaveExcelFile(List<Customers> customersList)
        {
            try
            {

                foreach (var customers in customersList)
                {
                    customers.IsActive = true;
                    customers.Status = "A";
                    customers.CustomerType = "L";
                    customers.CreatedDate = DateTime.UtcNow;
                    customers.IsDeleted = false;
                    customers.ModifiedDate = DateTime.UtcNow;
                    customers.DueDate = DateTime.Now.AddDays(2).ToShortDateString();
                    var LoggedInUser = (Users)Session["LoggedInUser"];
                    customers.CreatedBy = LoggedInUser == null ? 1 : LoggedInUser.LoginId;
                    customers.Description = "Imported from excel";

                    db.Customers.Add(customers);
                    db.SaveChangesAsync();

                }
                return true;
            }
            catch (Exception)
            {

                return false;
            }
        }

        // GET: Customers
        [HttpGet]
        public async Task<ActionResult> Index(string sortOrder, string currentFilter, string searchString, int? page, string CustomerType = "L", int DetailForUserID = 0)
        {



            var objUsers = (Users)Session["LoggedInUser"];
            var count = 0;


            string[] ab1 = new string[2];



            IQueryable<Customers> customers = db.Customers
                .Where(x => x.IsDeleted == false && x.IsActive == true)

                .Include(c => c.LeadSource)
                .Include(c => c.LeadStatu)
                .Include(c => c.Product)
                .Include(c => c.Stage);

            count = customers.Count();

            if (CustomerType == "0")
            {

            }
            else
            {
                customers = customers.Where(x => x.CustomerType == CustomerType);

            }



            if (DetailForUserID == 0)
            {

            }
            else if (DetailForUserID > 0)
            {
                customers = db.Customers.Where(x => x.LeadOwner == DetailForUserID && x.IsDeleted == false && x.IsActive == true);
            }
            else if (DetailForUserID == -1)
            {
                customers = db.Customers.Where(x => x.LeadOwner == objUsers.LoginId && x.IsDeleted == false && x.IsActive == true);
            }

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

            //customers = //db.Users.Join(customers,us => us.LoginId,(customers,us) => new { OwnerName = person.Name, Pet = pet.Name });


            //    (from u in db.Users
            //     join cu in customers
            //     on u.LoginId equals cu.LeadOwner
            //     select new { cu.IsActive, cu.Address, cu.City, cu.ConvertToPotential, cu.CreatedBy, cu.CreatedDate, cu.CustomerID, cu.CustomerType, cu.Deletedby, cu.Description, cu, u.FirstName, u.LastName }).ToList();




            return View(await customers.ToListAsync());
        }

        // GET: Customers
        public async Task<ActionResult> IndexMvcGrid()
        {
            var customers = db.Customers.Include(c => c.LeadSource).Include(c => c.LeadStatu).Include(c => c.Product).Include(c => c.Stage);
            return View(await customers.ToListAsync());
        }




        // GET: Customers/Details/5
        public async Task<ActionResult> Details(long? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Customers customers = await db.Customers.FindAsync(id);
            if (customers == null)
            {
                return HttpNotFound();
            }
            return View(customers);
        }

        // GET: Customers/Create
        public ActionResult Create()
        {
            ViewBag.LeadSourceId = new SelectList(db.LeadSources, "LeadSourceID", "SourceName");
            ViewBag.LeadStatusId = new SelectList(db.LeadStatus, "LeadStatusId", "LeadStatus");
            ViewBag.ProductId = new SelectList(db.Products, "ProductId", "ProductName");
            ViewBag.StageId = new SelectList(db.Stages, "StageId", "StageName");
            ViewBag.LeadOwnerList = new SelectList(db.Users, "LoginId", "Username");
            return View();
        }

        // POST: Customers/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([Bind(Include = "CustomerID,LeadOwner,FirstName,LastName,Email,Mobile,Website,ProductId,LeadStatusId,LeadSourceId,StageId,Password,FollowUp,Address,Phone,City,Investmentid,ConvertToPotential,DueDate,Description")] Customers customers)
        {


            //LeadOwner
            customers.IsActive = true;
            customers.Status = "A";


            if (customers.ConvertToPotential == 1)
            {
                customers.CustomerType = "P";
            }
            else
            {
                customers.CustomerType = "L";
            }
            //CreatedBy,
            customers.CreatedDate = DateTime.UtcNow;
            customers.IsDeleted = false;
            //Deletedby,
            //ModifiedBy,
            customers.ModifiedDate = DateTime.UtcNow;

            if (customers.DueDate == null)
            {
                customers.DueDate = DateTime.Now.AddDays(2).ToShortDateString();
            }
            else
            {
                try
                {

                    if (Convert.ToDateTime(customers.DueDate) >= DateTime.Now)
                    {

                    }

                }
                catch (Exception)
                {

                    customers.DueDate = DateTime.Now.AddDays(2).ToShortDateString();
                }
            }


            if (ModelState.IsValid)
            {
                db.Customers.Add(customers);

                await db.SaveChangesAsync();

                if (!string.IsNullOrWhiteSpace(customers.DueDate))
                {
                    try
                    {
                        var LoggedInUser = (Users)Session["LoggedInUser"];
                        db.PaymentDetails.Add(
                            new PaymentDetail
                            {
                                Active = true,
                                Amount = 0,
                                CreatedBy = LoggedInUser == null ? 1 : LoggedInUser.LoginId,
                                CreatedDate = DateTime.Now,
                                CustomerID = customers.CustomerID,
                                Description = "Giving Free Trial Services",
                                isLastService = true,
                                ServiceStartDate = DateTime.Now,
                                ServiceEndDate = Convert.ToDateTime(customers.DueDate),
                                ServiceType = 2 // 2 stand for free trials
                            });

                        await db.SaveChangesAsync();
                    }
                    catch (Exception)
                    {
                        throw;
                    }
                }


                if (customers.ConvertToPotential == 1)
                {
                    return RedirectToAction("Index", "Potentials");
                }
                else
                {
                    return RedirectToAction("Create");
                }

            }

            ViewBag.LeadSourceId = new SelectList(db.LeadSources, "LeadSourceID", "SourceName", customers.LeadSourceId);
            ViewBag.LeadStatusId = new SelectList(db.LeadStatus, "LeadStatusId", "LeadStatus", customers.LeadStatusId);
            ViewBag.ProductId = new SelectList(db.Products, "ProductId", "ProductName", customers.ProductId);
            ViewBag.StageId = new SelectList(db.Stages, "StageId", "StageName", customers.StageId);
            ViewBag.LeadOwnerList = new SelectList(db.Users, "LoginId", "Username");

            customers.ConvertToPotential = 0;
            return View(customers);
        }

        // GET: Customers/Edit/5
        public async Task<ActionResult> Edit(long? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }



            Customers customers = await db.Customers.FindAsync(id);
            if (customers == null)
            {
                return HttpNotFound();
            }


            System.Text.StringBuilder sb = new System.Text.StringBuilder();


            var a = await db.Descriptions.Where(x => x.CustomerID == id).ToListAsync();


            sb.Append(customers.Description);

            foreach (var ab in a)
            { sb.Append(ab.Description + " <br />"); }


            customers.Description = sb.ToString();

            var paymentDet = db.PaymentDetails.Where(x => x.CustomerID == id && x.isLastService == true && x.Active == true).OrderBy(x => x.CreatedDate).ToListAsync();

            ViewBag.LeadSourceId = new SelectList(db.LeadSources, "LeadSourceID", "SourceName", customers.LeadSourceId);
            ViewBag.LeadStatusId = new SelectList(db.LeadStatus, "LeadStatusId", "LeadStatus", customers.LeadStatusId);
            ViewBag.ProductId = new SelectList(db.Products, "ProductId", "ProductName", customers.ProductId);
            ViewBag.StageId = new SelectList(db.Stages, "StageId", "StageName", customers.StageId);
            ViewBag.LeadOwnerList = new SelectList(db.Users, "LoginId", "Username");
            return View(customers);
        }

        // POST: Customers/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include = "CustomerID,FirstName,LastName,LeadOwner,Email,Mobile,Website,ProductId,LeadStatusId,LeadSourceId,StageId,IsActive,Status,Password,FollowUp,Address,NewDescription,Phone,City,UserType,CreatedBy,CreatedDate,IsDeleted,Deletedby,ModifiedBy,ModifiedDate,Investmentid,ConvertToPotential")] Customers customers)
        {

            try
            {


                if (ModelState.IsValid)
                {
                    var LoggedInUser = (Users)Session["LoggedInUser"];


                    customers.ModifiedDate = DateTime.UtcNow;
                    customers.ModifiedBy = LoggedInUser.LoginId;

                    if (customers.ConvertToPotential == 1)
                    {
                        customers.CustomerType = "P";
                    }

                    db.Entry(customers).State = EntityState.Modified;
                    await db.SaveChangesAsync();


                    if (!string.IsNullOrWhiteSpace(customers.NewDescription))
                    {
                        if (customers.NewDescription.Length > 1)
                        {
                            Descriptions objDesc = new Descriptions();
                            objDesc.Description = customers.NewDescription;
                            db.Descriptions.Add(objDesc);
                            await db.SaveChangesAsync();
                        }

                    }




                    return RedirectToAction("Index");
                }
                ViewBag.LeadSourceId = new SelectList(db.LeadSources, "LeadSourceID", "SourceName", customers.LeadSourceId);
                ViewBag.LeadStatusId = new SelectList(db.LeadStatus, "LeadStatusId", "LeadStatus", customers.LeadStatusId);
                ViewBag.ProductId = new SelectList(db.Products, "ProductId", "ProductName", customers.ProductId);
                ViewBag.StageId = new SelectList(db.Stages, "StageId", "StageName", customers.StageId);
                ViewBag.LeadOwnerList = new SelectList(db.Users, "LoginId", "Username");
                return View(customers);
            }
            catch (Exception)
            {

                return RedirectToAction("Index", "Accounts");
            }
        }

        // GET: Customers/Delete/5
        public async Task<ActionResult> Delete(long? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Customers customers = await db.Customers.FindAsync(id);
            if (customers == null)
            {
                return HttpNotFound();
            }
            return View(customers);
        }

        // POST: Customers/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> DeleteConfirmed(long id)
        {
            Customers customers = await db.Customers.FindAsync(id);
            db.Customers.Remove(customers);
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


        [HttpGet]
        //[ValidateAntiForgeryToken]
        public async Task<ActionResult> ConvertToPotential(long? CustomerID)
        {

            var LoggedInUser = (Users)Session["LoggedInUser"];

            Customers customers = await db.Customers.FindAsync(Convert.ToInt32(CustomerID));
            customers.CustomerType = "P";
            customers.ModifiedDate = DateTime.Now;
            customers.ModifiedBy = LoggedInUser.LoginId;
            db.Entry(customers).State = EntityState.Modified;
            await db.SaveChangesAsync();

            //return RedirectToAction("Index", "Customers");


            return RedirectToAction("Create", "PaymentDetails", new { CustomerID = CustomerID });
        }

        [NonAction]
        private bool IsAjax(ExceptionContext filterContext)
        {
            return filterContext.HttpContext.Request.Headers["X-Requested-With"] == "XMLHttpRequest";
        }


        [HttpPost]
        public async Task<ActionResult> DeleteMultipleCustomers(string Ids)
        {
            try
            {

                if (!string.IsNullOrWhiteSpace(Ids))
                {
                    var list = Ids.Remove(Ids.Length - 1, 1).Split(',');

                    foreach (var id in list)
                    {

                        long kid = Convert.ToInt32(id);

                        Customers customers = db.Customers.Find(kid);

                        var LoggedInUser = (Users)Session["LoggedInUser"];

                        if (customers != null)
                        {

                            customers.IsActive = false;
                            customers.DueDate = "DateTime.Now()";
                            customers.IsDeleted = true;
                            customers.Deletedby = LoggedInUser.LoginId;
                            db.Entry(customers).State = EntityState.Modified;
                            await db.SaveChangesAsync();
                        }


                        PaymentDetail payment = db.PaymentDetails.Where(x => x.CustomerID == kid).SingleOrDefault();
                        if (payment != null)
                        {
                            payment.Active = false;
                            payment.isLastService = false;
                            payment.DeletedBy = LoggedInUser.LoginId;
                            db.Entry(payment).State = EntityState.Modified;
                            await db.SaveChangesAsync();

                            //Validation failed for one or more entities. See 'EntityValidationErrors' property for more details.
                        }



                    }
                    //await db.SaveChangesAsync();
                }

            }
            catch (System.Data.Entity.Validation.DbEntityValidationException ex)
            {
                System.Text.StringBuilder sb = new System.Text.StringBuilder();

                foreach (var failure in ex.EntityValidationErrors)
                {
                    sb.AppendFormat("{0} failed validation\n", failure.Entry.Entity.GetType());
                    foreach (var error in failure.ValidationErrors)
                    {
                        sb.AppendFormat("- {0} : {1}", error.PropertyName, error.ErrorMessage);
                        sb.AppendLine();
                    }
                }

                throw new System.Data.Entity.Validation.DbEntityValidationException(
                    "Entity Validation Failed - errors follow:\n" +
                    sb.ToString(), ex
                ); // Add the original exception as the innerException

            }

            //List<MCX.Models.CustomModel.UserDropdown> UserList = users.Select(x => new MCX.Models.CustomModel.UserDropdown
            //{
            //    LoginId = x.LoginId,
            //    Username = x.Username

            //}).ToList();

            return Json("1");

            //return RedirectToAction("Index", "Customers");

        }


        [HttpPost]
        public async Task<ActionResult> AssignedToXEmployees(string Ids, string LoginId)
        {

            string[] a = Ids.Split(',').ToArray();

            int id = 0;
            Customers objCustomer = null;

            try
            {

                for (int i = 0; i < (a.Length - 1); i++)
                {

                    try
                    {
                        id = Convert.ToInt32(a[i]);
                        if (id > 0)
                        {
                            objCustomer = new Customers();
                            objCustomer = db.Customers.Find(id);

                            objCustomer.LeadOwner = Convert.ToInt32(LoginId);
                            objCustomer.DueDate = DateTime.Now.ToShortDateString();
                            db.Entry(objCustomer).State = EntityState.Modified;
                        }
                        db.SaveChangesAsync();
                    }
                    catch
                    {

                    }
                }

            }
            catch (System.Data.Entity.Validation.DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {
                    Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"",
                            ve.PropertyName, ve.ErrorMessage);
                    }
                }
                throw;
            }

            return Json("Success");
        }



        protected override void OnException(ExceptionContext filterContext)
        {
            if (filterContext.ExceptionHandled || !filterContext.HttpContext.IsCustomErrorEnabled)
            {
                return;
            }

            // if the request is AJAX return JSON else view.
            if (IsAjax(filterContext))
            {
                //Because its a exception raised after ajax invocation
                //Lets return Json
                filterContext.Result = new JsonResult()
                {
                    Data = filterContext.Exception.Message,
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };

                filterContext.ExceptionHandled = true;
                filterContext.HttpContext.Response.Clear();
            }
            else
            {
                //Normal Exception
                //So let it handle by its default ways.
                base.OnException(filterContext);

            }
        }
    }
}
