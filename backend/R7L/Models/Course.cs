using System;
using System.Collections.Generic;

namespace R7L.Models;

public partial class Course
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string SystemName { get; set; } = null!;

    public string? Description { get; set; }

    public virtual ICollection<CourseUnit> CourseUnits { get; set; } = new List<CourseUnit>();
}
