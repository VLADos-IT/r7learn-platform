using System;
using System.Collections.Generic;

namespace R7L.Models;

public partial class CourseUnitType
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<CourseUnit> CourseUnits { get; set; } = new List<CourseUnit>();
}
