using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using R7L.DTO.User;
using R7L.Models;
using R7L.Services.User;
using System.Text;

namespace R7L.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly IUserService _service;


    public UserController(IUserService userService)
    {
        _service = userService;
    }


    [HttpPost("Authenticate")]
    [AllowAnonymous]
    public async Task<ActionResult<object>> AuthenticateUser([FromBody] UserAuthenticateDTO authenticateDTO)
    {
        var user = await _service.AuthenticateUser(authenticateDTO);
        if (user == null)
            return Unauthorized();

        var token = _service.GenerateJwtToken(user);

        return Ok(new
        {
            id = user.Id,
            login = user.Login,
            positionName = user.Position.Name,
            email = user.Email,
            firstName = user.FirstName,
            lastName = user.LastName,
            registrationDate = user.RegistrationDate,
            token = token
        });
    }

    [HttpPost("Create")]
    [AllowAnonymous]
    public async Task<ActionResult<object>> CreateUser([FromBody] UserCreateDTO createDTO)
    {
        var user = await _service.CreateUser(createDTO);
        if (user == null)
            return BadRequest("Не удалось создать пользователя");

        var token = _service.GenerateJwtToken(user);

        return Ok(new
        {
            id = user.Id,
            login = user.Login,
            positionName = user.Position.Name,
            email = user.Email,
            firstName = user.FirstName,
            lastName = user.LastName,
            registrationDate = user.RegistrationDate,
            token = token
        });
    }

    [HttpGet("{id:int}")]
    [Authorize]
    public async Task<ActionResult<UserReadDTO>> GetUser(int id)
    {
        var userIdStr = User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value
            ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var userRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

        if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out var userId))
            return Unauthorized();

        if (userRole != "admin" && userId != id)
            return Forbid();

        var user = await _service.GetUserById(id);
        if (user == null) return NotFound();
        return Ok(new UserReadDTO(user));
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
    [Authorize]
    public async Task<IActionResult> UpdateUser([FromBody] UserUpdateDTO dto)
    {
        var userIdStr = User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value
            ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out var userId))
            return Unauthorized();

        dto.Id = userId;

        try
        {
            await _service.UpdateUser(dto);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        return NoContent();
    }

    [HttpPut("ChangePassword")]
    [Authorize]
    public async Task<IActionResult> ChangePassword([FromBody] UserChangePasswordDTO dto)
    {
        var userIdStr = User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value
            ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out var userId))
            return Unauthorized();

        if (!await _service.IsPasswordCorrect(userId, dto.OldPassword))
            return BadRequest(new { error = "Old password is incorrect" });

        await _service.ChangeUserPassword(userId, dto.NewPassword);
        return NoContent();
    }

    [Authorize]
    [HttpGet("CurrentUser")]
    public async Task<ActionResult<UserReadDTO>> GetCurrentUser()
    {
        var userIdStr = User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value
            ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out var userId))
            return Unauthorized();

        var user = await _service.GetUserById(userId);
        if (user == null)
            return NotFound();

        return Ok(new UserReadDTO(user));
    }
}
