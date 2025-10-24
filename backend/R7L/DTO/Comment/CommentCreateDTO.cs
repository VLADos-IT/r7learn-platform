using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace R7L.DTO.Comment;

public class CommentCreateDTO
{
    [Required]
    public int CourseUnitId { get; set; }

    [Required]
    public int AuthorId { get; set; }

    [Required]
    [MaxLength(255)]
    public string Content { get; set; }

    [AllowNull]
    public int? ReplyToCommentId { get; set; }
}
