using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Web;

namespace MCX.HelperClass.Class
{
    public static class DataTableToListHelper
    {
        /// <summary>
        /// Created by vijay sahu on 10 April 2016
        /// It will compare the datatable column with the class property.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="table"></param>
        /// <returns></returns>
        public static List<T> DataTableToList<T>(this DataTable table) where T : class, new()
        {
            try
            {
                List<T> list = new List<T>();

                foreach (var row in table.AsEnumerable())
                {
                    T obj = new T();

                    foreach (var prop in obj.GetType().GetProperties())
                    {
                        try
                        {
                            PropertyInfo propertyInfo = obj.GetType().GetProperty(prop.Name);


                            var colCount = 0;
                            foreach (DataColumn col in table.Columns)
                            {
                                try
                                {
                                    if (col.ColumnName.Trim().ToString() == propertyInfo.Name.ToString())
                                    {
                                        propertyInfo.SetValue(obj, Convert.ChangeType(row[prop.Name], propertyInfo.PropertyType), null);

                                        
                                        break;
                                    }
                                    colCount++;
                                }
                                catch
                                {
                                    continue;
                                }
                            }
                        }
                        catch
                        {
                            continue;
                        }
                    }

                    list.Add(obj);
                }

                return list;
            }
            catch
            {
                return null;




            }
        }

    }
}