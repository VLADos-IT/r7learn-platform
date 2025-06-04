using System;
using System.Collections;
using System.Collections.Generic;

namespace R7L.Models;

public partial class CourseUnit
{
    public int Id { get; set; }

    public int CourseId { get; set; }

    public BitArray IsDeleted { get; set; } = null!;

    public int OrderInCourse { get; set; }

    public int CourseUnitTypeId { get; set; }

    public string Name { get; set; } = null!;

    public int MaxDegree { get; set; }

    public virtual Course Course { get; set; } = null!;

    public virtual CourseUnitType CourseUnitType { get; set; } = null!;

    public virtual ICollection<Test> Tests { get; set; } = new List<Test>();

    public virtual ICollection<UserCourseUnit> UserCourseUnits { get; set; } = new List<UserCourseUnit>();
}
