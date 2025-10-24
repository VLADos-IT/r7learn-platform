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


    public async Task<UserCourseUnitComment> CreateComment(CommentCreateDTO createDTO)
    {
        var newComment = _context.CreateProxy<UserCourseUnitComment>();

        newComment.CourseUnitId = createDTO.CourseUnitId;
        newComment.UserId = createDTO.AuthorId;
        newComment.Content = createDTO.Content;
        newComment.ReplyTo = createDTO.ReplyToCommentId;

        await _context.UserCourseUnitComments.AddAsync(newComment);
        await _context.SaveChangesAsync();

        return newComment;
    }

    public async Task<List<CommentReadDTO>> GetAllRepliesToComment(int commentId,
        int since, int count)
    {
        return await _context.UserCourseUnitComments
            .Where(c => c.ReplyTo == commentId && !c.IsDeleted)
            .Include(c => c.User)
            .Select(c => new CommentReadDTO(c, null))
            .Skip(since - 1)
            .Take(count)
            .ToListAsync();
    }

    public async Task<List<CommentReadDTO>> GetAllCommentsToCourseUnit(int courseUnitId,
        int since, int count)
    {
        List<CommentReadDTO> comments = await _context.UserCourseUnitComments
            .Where(c => c.CourseUnitId == courseUnitId && c.ReplyTo == null && !c.IsDeleted)
            .Include(c => c.User)
            .Select(c => new CommentReadDTO(c, c.InverseReplyToNavigation
                .Where(c => !c.IsDeleted)
                .Count()))
            .Skip(since - 1)
            .Take(count)
            .ToListAsync();

        return comments;
    }

    public async Task DeleteComment(int commentId)
    {
        Models.UserCourseUnitComment? comment = await _context.UserCourseUnitComments
            .Where(c => c.Id == commentId)
            .FirstOrDefaultAsync();

        if (comment is null)
            throw Errors.Errors.KeyNotFound("user course unit comment", "id", commentId);

        comment.IsDeleted = true;
        await _context.SaveChangesAsync();
    }
}
