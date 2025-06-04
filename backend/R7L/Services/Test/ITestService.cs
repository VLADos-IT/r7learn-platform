using R7L.DTO.Test;

namespace R7L.Services.Test;

public interface ITestService
{
    Task<Models.Test> GetTestByCourseUnitId(int courseUnitId);

    Task<TestReadDTO> GetTestReadDTO(int courseUnitId);

    Task<Models.Test> CreateTest(TestCreateDTO createDTO);

    Task<Models.TestQuestion> CreateTestQuestion(TestQuestionCreateDTO createDTO);

    Task<Models.TestQuestionOption> CreateTestQuestionOption(
        TestQuestionOptionCreateDTO createDTO);

    Task ChangeTest(TestUpdateDTO updateDTO);

    Task ChangeTestQuestion(TestQuestionUpdateDTO updateDTO);

    Task ChangeTestQuestionOption(TestQuestionOptionUpdateDTO updateDTO);

    Task DeleteTestQuestion(int questionId);

    Task DeleteTestQuestionOption(int optionId);

    Task CreateOrChangeTestQuestionAnswer(int userId, TestQuestionAnswerDTO questionAnswerDTO);

    Task<int> CreateOrChangeTestAnswer(TestAnswerDTO testAnswerDTO);

    Task<int> CheckUserTestAnswers(int userId, int testId);
}
