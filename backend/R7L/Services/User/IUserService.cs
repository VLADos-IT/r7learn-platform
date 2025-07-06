using R7L.DTO.User;

namespace R7L.Services.User;

public interface IUserService
{
    Task<Models.User> GetUserById(int id);

    Task<Models.User> CreateUser(UserCreateDTO createDTO);

    Task UpdateUser(UserUpdateDTO updateDTO);

    Task<bool> IsPasswordCorrect(int userId, string password);

    Task ChangeUserPassword(int userId, string password);

    Task<Models.User> AuthenticateUser(UserAuthenticateDTO authenticateDTO);

    Task<bool> IsLoginUnique(string login);

    Task<bool> IsEmailUnique(string email);

    string GenerateJwtToken(Models.User user);
}
