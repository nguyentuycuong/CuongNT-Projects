using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{
    public class Category:AuditableEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Order { get; set; }
        public bool IsActive { get; set; }
        public string AppName { get; set; }
        public string UserId { get; set; }
        public int CategoryParent { get; set; }
        public string Icon { get; set; }
    }
}
