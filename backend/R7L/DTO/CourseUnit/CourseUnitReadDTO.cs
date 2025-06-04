namespace R7L.DTO.CourseUnit;

public class CourseUnitReadDTO
{
    public int Id { get; set; }

    public int OrderInCourse { get; set; }

    public string CourseUnitTypeName { get; set; }

    public string Name { get; set; }

    public int MaxDegree { get; set; }

    
    public CourseUnitReadDTO(Models.CourseUnit courseUnit)
    {
        Id = courseUnit.Id;
        OrderInCourse = courseUnit.OrderInCourse;
        CourseUnitTypeName = courseUnit.CourseUnitType.Name;
        Name = courseUnit.Name;
        MaxDegree = courseUnit.MaxDegree;
    }
}