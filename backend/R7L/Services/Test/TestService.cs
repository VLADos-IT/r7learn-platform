using Microsoft.EntityFrameworkCore;
using R7L.DTO.CourseProgress;
using R7L.DTO.Test;
using R7L.Models;
using R7L.Services.CourseProgress;
using System.Collections;

namespace R7L.Services.Test;

public class TestService : ITestService
{
    private readonly string _courseUnitTestTypeName = "test";
    private readonly AppDbContext _context;

    public TestService(AppDbContext context)
    {
        _context = context;
    }


    public async Task<Models.Test> GetTestByCourseUnitId(int courseUnitId)
    {
        Models.Test? test = await _context.Tests
            .FirstOrDefaultAsync(t => t.CourseUnitId == courseUnitId);

        if (test is null)
            throw Errors.Errors.KeyNotFound("test", "course unit id", courseUnitId);

        return test;
    }

    public async Task<Models.Test> GetTestById(int testId)
    {
        Models.Test? test = await _context.Tests
            .FirstOrDefaultAsync(t => t.Id == testId);

        if (test is null)
            throw Errors.Errors.KeyNotFound("test", "id", testId);

        return test;
    }

    public async Task<Models.TestQuestionType> GetTestQuestionTypeByName(string name)
    {
        Models.TestQuestionType? type = await _context.TestQuestionTypes
            .FirstOrDefaultAsync(t => t.Name == name);

        if (type is null)
            throw Errors.Errors.KeyNotFound("test question type", "name", name);

        return type;
    }

    public async Task<Models.TestQuestion> GetTestQuestionById(int questionId)
    {
        Models.TestQuestion? question = await _context.TestQuestions
            .FirstOrDefaultAsync(q => q.Id == questionId);

        if (question is null)
            throw Errors.Errors.KeyNotFound("test question", "id", questionId);

        return question;
    }

    public async Task<Models.TestQuestionOption> GetTestQuestionOptionById(int optionId)
    {
        Models.TestQuestionOption? option = await _context.TestQuestionOptions
            .FirstOrDefaultAsync(o => o.Id == optionId);

        if (option is null)
            throw Errors.Errors.KeyNotFound("test question option", "id", optionId);

        return option;
    }

    public async Task<TestReadDTO> GetTestReadDTO(int courseUnitId)
    {
        TestReadDTO result = new TestReadDTO();

        Models.Test test = await GetTestByCourseUnitId(courseUnitId);
        result.Description = test.Description;
        result.Id = test.Id;

        List<TestQuestionReadDTO> testQuestions = test.TestQuestions
            .Select(tq => new TestQuestionReadDTO(tq))
            .ToList();

        result.Questions = testQuestions;

        return result;
    }

    public async Task<Models.Test> CreateTest(TestCreateDTO createDTO)
    {
        Models.CourseUnit? courseUnit = await _context.CourseUnits
            .FirstOrDefaultAsync(cu => cu.Id == createDTO.CourseUnitId);

        if (courseUnit is null)
            throw Errors.Errors.KeyNotFound("course unit", "id", createDTO.CourseUnitId);

        if (courseUnit.CourseUnitType.Name.ToLower() != _courseUnitTestTypeName)
            throw new Exception($"'course unit type' of 'test' must be '{_courseUnitTestTypeName}'");

        var newTest = _context.CreateProxy<Models.Test>();

        newTest.CourseUnitId = createDTO.CourseUnitId;
        newTest.Description = createDTO.Description;

        await _context.Tests.AddAsync(newTest);
        await _context.SaveChangesAsync();

        return newTest;
    }

    public async Task<Models.TestQuestion> CreateTestQuestion(TestQuestionCreateDTO createDTO)
    {
        var newQuestion = _context.CreateProxy<Models.TestQuestion>();

        TestQuestionType? type = await GetTestQuestionTypeByName(createDTO.TypeName);

        newQuestion.TestId = createDTO.TestId;
        newQuestion.TypeId = type.Id;
        newQuestion.Question = createDTO.Question;

        await _context.TestQuestions.AddAsync(newQuestion);
        await _context.SaveChangesAsync();

        return newQuestion;
    }

    public async Task<Models.TestQuestionOption> CreateTestQuestionOption(
        TestQuestionOptionCreateDTO createDTO)
    {
        var newOption = _context.CreateProxy<Models.TestQuestionOption>();

        newOption.QuestionId = createDTO.QuestionId;
        newOption.Content = createDTO.Content;
        newOption.IsCorrect = new BitArray([createDTO.IsCorrect]);

        await _context.TestQuestionOptions.AddAsync(newOption);
        await _context.SaveChangesAsync();

        return newOption;
    }

    public async Task ChangeTest(TestUpdateDTO updateDTO)
    {
        Models.Test test = await GetTestById(updateDTO.Id);

        test.Description = updateDTO.Description;

        await _context.SaveChangesAsync();
    }

    public async Task ChangeTestQuestion(TestQuestionUpdateDTO updateDTO)
    {
        Models.TestQuestion question = await GetTestQuestionById(updateDTO.Id);
        Models.TestQuestionType type = await GetTestQuestionTypeByName(updateDTO.TypeName);

        question.Question = updateDTO.Question;
        question.TypeId = type.Id;

        await _context.SaveChangesAsync();
    }

    public async Task ChangeTestQuestionOption(TestQuestionOptionUpdateDTO updateDTO)
    {
        Models.TestQuestionOption option = await GetTestQuestionOptionById(updateDTO.Id);

        option.Content = updateDTO.Content;
        option.IsCorrect = new BitArray([updateDTO.IsCorrect]);

        await _context.SaveChangesAsync();
    }

    public async Task DeleteTestQuestion(int questionId)
    {
        Models.TestQuestion question = await GetTestQuestionById(questionId);

        _context.TestQuestionOptions.RemoveRange(question.TestQuestionOptions);
        _context.TestQuestions.Remove(question);

        await _context.SaveChangesAsync();
    }

    public async Task DeleteTestQuestionOption(int optionId)
    {
        Models.TestQuestionOption option = await GetTestQuestionOptionById(optionId);

        _context.TestQuestionOptions.Remove(option);

        await _context.SaveChangesAsync();
    }

    public async Task<int> CheckUserTestAnswers(int userId, int testId)
    {
        Models.Test test = await GetTestById(testId);
        int userTestDegree = await CalculateUserTestDegree(userId, test);

        await UpdateUserTestDegree(userId, test.CourseUnitId, userTestDegree);
        return userTestDegree;
    }

    public async Task<int> CreateOrChangeTestAnswer(TestAnswerDTO testAnswerDTO)
    {
        foreach (TestQuestionAnswerDTO answerDTO in testAnswerDTO.QuestionsAnswers)
            await CreateOrChangeTestQuestionAnswer(testAnswerDTO.UserId, answerDTO);

        return await CheckUserTestAnswers(testAnswerDTO.UserId, testAnswerDTO.TestId);
    }

    public async Task CreateOrChangeTestQuestionAnswer(int userId, TestQuestionAnswerDTO answerDTO)
    {
        bool isAnswerExist = await _context.TestQuestionUserAnswers
            .AnyAsync(ua => ua.UserId == userId
                         && ua.TestQuestionId == answerDTO.QuestionId);

        if (isAnswerExist)
            await DeleteTestQuestionAnswer(userId, answerDTO.QuestionId);

        foreach (int answerId in answerDTO.Answers)
            await CreateTestQuestionAnswer(userId, answerDTO.QuestionId, answerId);
    }

    private async Task<int> CalculateUserTestDegree(int userId, Models.Test test)
    {
        int result = 0;

        foreach (Models.TestQuestion question in test.TestQuestions)
            if (await IsUserAnswerCorrect(userId, question))
                result++;

        return result;
    }

    private async Task<bool> IsUserAnswerCorrect(int userId, Models.TestQuestion testQuestion)
    {
        List<int> userAnswers = testQuestion.TestQuestionUserAnswers
            .Where(tqua => tqua.UserId == userId)
            .Select(tqua => tqua.AnswerId)
            .ToList();

        List<int> correctAnswers = testQuestion.TestQuestionOptions
            .Where(tqo => tqo.IsCorrect[0] == true)
            .Select(tqo => tqo.Id)
            .ToList();

        if (userAnswers.Count != correctAnswers.Count)
            return false;

        foreach (int correctAnswer in correctAnswers)
            if (!userAnswers.Contains(correctAnswer))
                return false;

        return true;
    }

    private async Task UpdateUserTestDegree(int userId, int courseUnitId, int newDegree)
    {
        var courseProgressService = new CourseProgressService(_context);

        await courseProgressService.UpdateCourseUnitUserProgress(
            new CourseUnitProgressUpdateDTO
            {
                CourseUnitId = courseUnitId,
                UserId = userId,
                Degree = newDegree
            }
        );
    }

    private async Task CreateTestQuestionAnswer(int userId, int questionId, int answerId)
    {
        var newAnswer = _context.CreateProxy<Models.TestQuestionUserAnswer>();

        newAnswer.UserId = userId;
        newAnswer.TestQuestionId = questionId;
        newAnswer.AnswerId = answerId;

        await _context.TestQuestionUserAnswers.AddAsync(newAnswer);
        await _context.SaveChangesAsync();
    }

    private async Task DeleteTestQuestionAnswer(int userId, int questionId)
    {
        Models.TestQuestion question = await GetTestQuestionById(questionId);

        List<Models.TestQuestionUserAnswer> answers = question.TestQuestionUserAnswers
            .Where(tqua => tqua.UserId == userId).ToList();

        _context.TestQuestionUserAnswers.RemoveRange(answers);
        await _context.SaveChangesAsync();
    }
}
