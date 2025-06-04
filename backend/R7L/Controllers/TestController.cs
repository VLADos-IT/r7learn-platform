using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using R7L.DTO.Test;
using R7L.Services.Test;

namespace R7L.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TestController : Controller
{
    private readonly ITestService _service;


    public TestController(ITestService courseUnitService)
    {
        _service = courseUnitService;
    }


    [HttpGet("{courseUnitId:int}")]
    public async Task<ActionResult<TestReadDTO>> GetTestByCourseUnitId(int courseUnitId)
    {
        TestReadDTO readDTO;

        try
        {
            readDTO = await _service.GetTestReadDTO(courseUnitId);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }

        return Ok(readDTO);
    }

    [HttpPost("Create")]
    public async Task<ActionResult<int>> CreateTest([FromBody] TestCreateDTO createDTO)
    {
        Models.Test newTest;

        try
        {
            newTest = await _service.CreateTest(createDTO);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }

        return Ok(newTest.Id);
    }

    [HttpPost("Question/Create")]
    public async Task<ActionResult<int>> CreateTestQuestion(
        [FromBody] TestQuestionCreateDTO createDTO)
    {
        Models.TestQuestion newQuestion;

        try
        {
            newQuestion = await _service.CreateTestQuestion(createDTO);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }

        return Ok(newQuestion.Id);
    }

    [HttpPost("Question/Option/Create")]
    public async Task<ActionResult<int>> CreateTestQuestionOption(
        [FromBody] TestQuestionOptionCreateDTO createDTO)
    {
        Models.TestQuestionOption newOption;

        try
        {
            newOption = await _service.CreateTestQuestionOption(createDTO);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }

        return Ok(newOption.Id);
    }

    [HttpPut("Update")]
    public async Task<ActionResult> UpdateTest([FromBody] TestUpdateDTO updateDTO)
    {
        try
        {
            await _service.ChangeTest(updateDTO);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }

        return NoContent();
    }

    [HttpPut("Question/Update")]
    public async Task<ActionResult> UpdateTestQuestion(
        [FromBody] TestQuestionUpdateDTO updateDTO)
    {
        try
        {
            await _service.ChangeTestQuestion(updateDTO);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }

        return NoContent();
    }

    [HttpPut("Question/Option/Update")]
    public async Task<ActionResult> UpdateTestQuestionOption(
        [FromBody] TestQuestionOptionUpdateDTO updateDTO)
    {
        try
        {
            await _service.ChangeTestQuestionOption(updateDTO);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }

        return NoContent();
    }

    [HttpDelete("Question/Delete/{questionId:int}")]
    public async Task<ActionResult> DeleteTestQuestion(int questionId)
    {
        try
        {
            await _service.DeleteTestQuestion(questionId);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }

        return NoContent();
    }
    
    [HttpDelete("Question/Option/Delete/{optionId:int}")]
    public async Task<ActionResult> DeleteTestQuestionOption(int optionId)
    {
        try
        {
            await _service.DeleteTestQuestionOption(optionId);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }

        return NoContent();
    }

    [HttpPut("Answer/Update")]
    public async Task<ActionResult<int>> UpdateUserTestAnswer([FromBody] TestAnswerDTO answerDTO)
    {
        int userTestDegree;

        try
        {
            userTestDegree = await _service.CreateOrChangeTestAnswer(answerDTO);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }

        return Ok(userTestDegree);
    }
}
