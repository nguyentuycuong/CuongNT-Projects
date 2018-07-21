using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace oHoob.ViewModels
{
    public class CategoryViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Order { get; set; }
        public bool IsActive { get; set; }
    }
}
