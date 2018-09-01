﻿// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class Product : AuditableEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Icon { get; set; }            
        public decimal BuyingPrice { get; set; }
        public decimal SellingPrice { get; set; }
        public int UnitsInStock { get; set; }
        public bool IsActive { get; set; }
        public bool IsDiscontinued { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }

        public string Gallery { get; set; }
        public decimal OldPrice { get; set; }
        public bool IsPromote { get; set; }
        public bool IsHot { get; set; }
        public string ProductCode { get; set; }
        public DateTime ReleaseDate { get; set; }
        public int StarRating { get; set; }
        public string InfoDetail { get; set; }
        public string Content { get; set; }

        //public int? ParentId { get; set; }
        //public Product Parent { get; set; }

        public int ProductCategoryId { get; set; }
        //public ProductCategory ProductCategory { get; set; }

        //public ICollection<Product> Children { get; set; }
        //public ICollection<OrderDetail> OrderDetails { get; set; }
    }
}
