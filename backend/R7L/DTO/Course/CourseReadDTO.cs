namespace R7L.DTO.Course;

public class CourseReadDTO
{
    public int Id { get; set; }

    public string Name { get; set; }

    public string SystemName { get; set; }

    public string? Description { get; set; }

    
    public CourseReadDTO(Models.Course course)
    {
        Id = course.Id;
        Name = course.Name;
        SystemName = course.SystemName;
        Description = course.Description;
    }
}
