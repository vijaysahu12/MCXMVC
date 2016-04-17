﻿using MCX.Models.Tables;
using System.Data.Entity;

namespace MCX.Models.DbEntities
{
    public class DbEntities : DbContext
    {

        public DbEntities()
            : base("name=MCX")
        {

        }
        public DbSet<Users> Users { get; set; }

        public DbSet<Customers> Customers { get; set; }

        public DbSet<LeadStatu> LeadStatus { get; set; }

        public DbSet<Product> Products { get; set; }

        public DbSet<Stage> Stages { get; set; }

        public DbSet<LeadSources> LeadSources { get; set; }


        public DbSet<PaymentDetail> PaymentDetails { get; set; }

        public DbSet<Descriptions> Descriptions { get; set; }



        //public DbSet<Login> Logins { get; set; }
    }



    public interface ICustomRepository
    {

        void add();
        void update();
        void get();
    }

    public class CustomeRepository<T> where T : class
    {
        private readonly DbContext Context;
        private IDbSet<T> Entities;

        private void Add(T entity)
        {
            if (entity != null)
            {

            }
        }
    }
}