using Microsoft.EntityFrameworkCore;
using R7L.DTO.Comment;
using R7L.Models;

namespace R7L.Services.Comment;

public class CommentService : ICommentService
{
    private readonly AppDbContext _context;


    public CommentService(AppDbContext context)
    {
        _context = context;
    }


    public async Task<UserCourseUnitComment> GetCommentById(int commentId)
    {
        UserCourseUnitComment? comment = await _context.UserCourseUnitComments
            .Where(c => c.Id == commentId)
            .FirstOrDefaultAsync();

        if (comment is null)
            throw Errors.Errors.KeyNotFound("user course unit comment", "id", commentId);

        return comment;
    }

    public async Task<UserCourseUnitComment> CreateComment(CommentCreateDTO createDTO)
    {
        var newComment = _context.CreateProxy<UserCourseUnitComment>();

        newComment.CourseUnitId = createDTO.CourseUnitId;
        newComment.UserId = createDTO.AuthorId;
        newComment.Content = createDTO.Content;
        newComment.ReplyTo = createDTO.ReplyToCommentId;

        newComment.PublicationDateTime = DateTime.Now;

        await _context.UserCourseUnitComments.AddAsync(newComment);
        await _context.SaveChangesAsync();

        return newComment;
    }

    public async Task<List<CommentReadDTO>> GetComments(int courseUnitId,
        int? replyTo, bool sortAscending, int since, int count)
    {
        var comments = _context.UserCourseUnitComments
            .Where(c => c.CourseUnitId == courseUnitId && c.ReplyTo == replyTo && !c.IsDeleted)
            .Include(c => c.User);

        var sortedComments = (sortAscending)
            ? comments.OrderBy(c => c.PublicationDateTime)
            : comments.OrderByDescending(c => c.PublicationDateTime);
        
        return await sortedComments
            .Skip(since - 1)
            .Take(count)
            .Select(c => new CommentReadDTO(c, (replyTo == null)
                ? c.InverseReplyToNavigation.Where(c => !c.IsDeleted).Count()
                : null
            ))
            .ToListAsync();
    }

    public async Task DeleteComment(int commentId)
    {
        UserCourseUnitComment comment = await GetCommentById(commentId);
        comment.IsDeleted = true;
        await _context.SaveChangesAsync();
    }
}
