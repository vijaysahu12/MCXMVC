using System.Data.Entity.Core.Objects;
//using FileHelpers;
//using FileHelpers.DataLink;
using MCX.Models.Tables;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Excel = Microsoft.Office.Interop.Excel;
using System.Data;
using MCX.HelperClass.Interface;
using System.Reflection;
namespace MCX.HelperClass
{



    public class Helper : IExceReaderlHelper
    {
        string result = "";

        readonly Helper _Helper;

        private Helper()
        {

        }

        public List<Customers> readExcelFile(string path)
        {
            List<Customers> objCustomerList = new List<Customers>();

            System.Data.DataTable dt = null;
            try
            {

                //create oledb connection to spreadsheet
                string connectionString = String.Format("Provider=Microsoft.ACE.OLEDB.12.0;Data Source={0};Extended Properties=\"Excel 12.0;HDR=Yes;IMEX=1;\";", path);
                System.Data.OleDb.OleDbConnection Excelcon = new System.Data.OleDb.OleDbConnection(connectionString);
                System.Data.OleDb.OleDbDataAdapter ad = new System.Data.OleDb.OleDbDataAdapter();
                ad.SelectCommand = new System.Data.OleDb.OleDbCommand("SELECT * FROM [Sheet1$]", Excelcon);
                dt = new System.Data.DataTable();
                ad.Fill(dt);



                Customers objCustomer = null;

                foreach (System.Data.DataRow dr in dt.Rows)
                {
                    objCustomer = new Customers();
                    objCustomer.FirstName = dr[0].ToString();
                    objCustomer.LastName = dr[1].ToString();
                    objCustomer.Mobile = dr[2].ToString();
                    objCustomer.Email = dr[3].ToString();
                    objCustomer.ProductId = 1;// dr[4];
                    objCustomerList.Add(objCustomer);
                }
            }
            catch (Exception ex)
            {
                result = ex.Message;
            }
            return objCustomerList;
        }
        public string readExcelFile(string path, string transactionType)
        {
            result = "";
            System.Data.DataTable dt = null;
            try
            {

                //create oledb connection to spreadsheet
                string connectionString = String.Format("Provider=Microsoft.ACE.OLEDB.12.0;Data Source={0};Extended Properties=\"Excel 12.0;HDR=Yes;IMEX=1;\";", path);
                System.Data.OleDb.OleDbConnection Excelcon = new System.Data.OleDb.OleDbConnection(connectionString);
                System.Data.OleDb.OleDbDataAdapter ad = new System.Data.OleDb.OleDbDataAdapter();
                ad.SelectCommand = new System.Data.OleDb.OleDbCommand("SELECT * FROM [Sheet1$]", Excelcon);
                //dt = new DataTable();
                //ad.Fill(dt);


                dt = new System.Data.DataTable();
                ad.Fill(dt);

                string ab = "";
                foreach (System.Data.DataRow dr in dt.Rows)
                {
                    ab = dr[0].ToString();
                }
                //BulkInsert_D.BulkInsert_D.conne = conne;
                //result = BulkInsert_D.BulkInsert_D.bulkInsert(dt, "xls", transactionType);
            }
            catch (Exception ex)
            {
                result = ex.Message;
            }
            return result;
        }
        public DataTable readExcelFileToDT(string fileName)
        {

            try
            {

                Excel.Application xlApp = new Excel.Application();
                Excel.Workbook xlWorkbook = xlApp.Workbooks.Open(fileName, 0, true, 5, "", "", true, Excel.XlPlatform.xlWindows, "\t", false, false, 0, true, 1, 0);
                Excel._Worksheet xlWorksheet = (Excel._Worksheet)xlWorkbook.Sheets[1];
                Excel.Range xlRange = xlWorksheet.UsedRange;

                int rowCount = xlRange.Rows.Count;
                //int colCount = xlRange.Columns.Count;
                int temp = 1;
                DataTable dt = new DataTable();
                int rowIndex = 1;
                string ab = "";
                while (((Microsoft.Office.Interop.Excel.Range)xlWorksheet.Cells[rowCount, temp]).Value2 != null)
                {
                    ab = Convert.ToString(((Microsoft.Office.Interop.Excel.Range)xlWorksheet.Cells[rowIndex, temp]).Value2);
                    dt.Columns.Add(ab.Trim());
                    temp++;
                }

                DataRow row = null;
                rowIndex = Convert.ToInt32(rowIndex) + 1;
                int columnCount = temp;
                temp = 1;

                while (((Microsoft.Office.Interop.Excel.Range)xlWorksheet.Cells[rowIndex, temp]).Value2 != null)
                {
                    row = dt.NewRow();
                    for (int i = 1; i < columnCount; i++)
                    {
                        row[i - 1] = Convert.ToString(((Microsoft.Office.Interop.Excel.Range)xlWorksheet.Cells[rowIndex, i]).Value2);
                    }
                    dt.Rows.Add(row);
                    rowIndex = Convert.ToInt32(rowIndex) + 1;
                    temp = 1;
                }

                return dt;
            }
            catch (System.Data.DuplicateNameException ex)
            {
                throw new Exception("Please remove duplicate column from sheet.");
            }
            catch (Exception ex)
            {
                //A column named 'lkj' already belongs to this DataTable.

                throw ex;
            }

        }






        public int multiply(int a, int b)
        {
            return a * b;
        }



        public void readExcelFileHelpers(string path)
        {
            //ExcelStorage es = new ExcelStorage(typeof(CustomersExcel), 0, 0);
            //es.FileName = path;

            //es.ExcelReadStopAfterEmptyRows = 2;

            //var abc = es.ExtractRecordsAsDT();

            //foreach (var a in abc.Rows)
            //{
            //    string aaas = a.ToString();
            //}
        }



        //public void readExcelThroughInterOp()
        //{
        //}
        //public void ExportToExcel()
        //{
        //    //try
        //    //{
        //    //    eTracLoginModel ObjLoginModel = null;
        //    //    ObjectParameter paramTotalRecords = new ObjectParameter("TotalRecords", typeof(int));
        //    //    if (Session["eTrac"] != null)
        //    //    { ObjLoginModel = (eTracLoginModel)(Session["eTrac"]); }

        //    //    string sortColumnName = "ItemName";
        //    //    string operationName = "GetAllInventory";
        //    //    string sortOrderBy = "desc";
        //    //    string fileName = ObjLoginModel.Location.Replace(" ", "-") + "_" + DateTime.Now.ToString("yyyy-MM-dd") + ".xls";
        //    //    string imageURL = ConfigurationManager.AppSettings["hostingPrefix"] + "Images/logo2.png";
        //    //    InventoryList = _ManageManager.GetAllInventory(ProjectID, "GetAllInventory", pageIndex, numberOfRows, sortColumnName, sortOrderBy, textSearch, InventoryType, ItemOwn, paramTotalRecords);
        //    //    var grid = new GridView();
        //    //    if (InventoryType == 196)
        //    //    {

        //    //        grid.DataSource = from p in InventoryList
        //    //                          select new
        //    //                          {
        //    //                              InventoryID = p.InventoryID,
        //    //                              ItemCode = p.ItemCode,
        //    //                              ItemName = p.ItemName,
        //    //                              Description = p.Description,
        //    //                              ItemTypeName = p.ItemTypeName,
        //    //                              Quantity = p.Quantity,
        //    //                              LocationId = p.LocationId
        //    //                          };
        //    //    }
        //    //    else
        //    //    {
        //    //        grid.DataSource = from p in InventoryList
        //    //                          select new
        //    //                          {
        //    //                              AssignInventoryID = p.AssignInventoryID,
        //    //                              LocationId = p.LocationId,
        //    //                              ItemName = p.ItemName,
        //    //                              ItemCode = p.ItemCode,
        //    //                              ItemTypeName = p.ItemTypeName,
        //    //                              AssginedQuantity = p.AssginedQuantity,
        //    //                              AssignedToName = p.AssignedToName,
        //    //                              IssueDate = p.IssueDate,
        //    //                              ReturnDate = p.ReturnDate
        //    //                          };
        //    //    }
        //    //    grid.DataBind();
        //    //    Response.ClearContent();
        //    //    Response.AddHeader("content-disposition", "attachment; filename=" + fileName);
        //    //    Response.ContentType = "application/excel";
        //    //    StringWriter sw = new StringWriter();
        //    //    HtmlTextWriter htw = new HtmlTextWriter(sw);
        //    //    grid.RenderControl(htw);
        //    //    //string headerTable = @"<Table><tr><td><img src="+imageURL+"></img></td></tr></Table>";
        //    //    //Response.Write(headerTable);
        //    //    Response.Write(sw.ToString());
        //    //    Response.End();

        //    //    return View("ListInventory");
        //    //    //return PartialView("ListInventory");
        //    //}
        //    //catch (Exception ex)
        //    //{
        //    //    throw ex;
        //    //}
        //}
    }
}