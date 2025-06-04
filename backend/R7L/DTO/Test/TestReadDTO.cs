namespace R7L.DTO.Test;

public class TestReadDTO
{
    public int Id { get; set; }

    public string? Description { get; set; }

    public List<TestQuestionReadDTO> Questions { get; set; }
}
