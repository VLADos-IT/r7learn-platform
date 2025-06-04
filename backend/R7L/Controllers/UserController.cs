using Microsoft.AspNetCore.Mvc;
using R7L.DTO.User;
using R7L.Models;
using R7L.Services.User;

namespace R7L.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UserController : Controller
{
    private readonly IUserService _service;


    public UserController(IUserService userService)
    {
        _service = userService;
    }


    [HttpPost("Create")]
    public async Task<ActionResult<UserReadDTO>> CreateUser([FromBody] UserCreateDTO createDTO)
    {
        bool isLoginUnique = await _service.IsLoginUnique(createDTO.Login);
        bool isEmailUnique = await _service.IsEmailUnique(createDTO.Email);

        if (!isLoginUnique || !isEmailUnique)
            return BadRequest("User email or login is not unique");

        User createdUser = await _service.CreateUser(createDTO);
        var createdUserReadDTO = new UserReadDTO(createdUser);

        return Ok(createdUserReadDTO);
    }

    [HttpPost("Authenticate")]
    public async Task<ActionResult<UserReadDTO>> AuthenticateUser(
        [FromBody] UserAuthenticateDTO authenticateDTO)
    {
        User user = await _service.AuthenticateUser(authenticateDTO);

        if (user is null)
            return Unauthorized();

        var userReadDTO = new UserReadDTO(user);
        return Ok(userReadDTO);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<UserReadDTO>> GetUser(int id)
    {
        User user = await _service.GetUserById(id);

        if (user is null)
            return NotFound();

        var userReadDTO = new UserReadDTO(user);
        return Ok(userReadDTO);
    }

    [HttpPost("CheckLoginAndEmailUniqueness")]
    public async Task<ActionResult<object>> CheckLoginAndEmailUniqueness(
        [FromBody] UserUniqueInfoDTO uniqueInfoDTO)
    {
        bool isLoginUnique = await _service.IsLoginUnique(uniqueInfoDTO.Login);
        bool isEmailUnique = await _service.IsEmailUnique(uniqueInfoDTO.Email);

        return Ok(new
        {
            LoginIsUnique = isLoginUnique,
            EmailIsUnique = isEmailUnique
        });
    }

    [HttpPut("Update")]
    public async Task<ActionResult> UpdateUser([FromBody] UserUpdateDTO updateDTO)
    {
        try
        {
            await _service.UpdateUser(updateDTO);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
        
        return NoContent();
    }

    [HttpPatch("ChangePassword/{userId:int}")]
    public async Task<ActionResult> ChangeUserPassword(int userId,
        [FromBody] UserChangePasswordDTO changePasswordDTO)
    {
        try
        {
            if (!(await _service.IsPasswordCorrect(userId, changePasswordDTO.OldPassword)))
                throw new Exception("old password is incorrect");

            await _service.ChangeUserPassword(userId, changePasswordDTO.NewPassword);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }

        return NoContent();
    }
}
