using R7L.Models;

namespace R7L.DTO.Comment;

public class CommentReadDTO
{
    public int Id { get; set; }

    public string AuthorFirstName { get; set; }

    public string AuthorLastName { get; set; }

    public string Content { get; set; }

    public DateTime PublicationDateTime {  get; set; }

    public int? RepliesCount { get; set; }


    public CommentReadDTO(UserCourseUnitComment comment, int? repliesCount = null)
    {
        Id = comment.Id;
        AuthorFirstName = comment.User.FirstName;
        AuthorLastName = comment.User.LastName;
        Content = comment.Content;
        PublicationDateTime = comment.PublicationDateTime;

        RepliesCount = repliesCount;
    }
}
