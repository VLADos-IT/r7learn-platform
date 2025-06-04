using Microsoft.EntityFrameworkCore;
using R7L.DTO.User;
using R7L.Erorrs;
using System.Security.Cryptography;
using Konscious.Security.Cryptography;
using System.Text;

namespace R7L.Services.User;

public class UserService : IUserService
{
    private readonly int _saltLength;
    private readonly AppDbContext _context;


    public UserService(AppDbContext context)
    {
        _context = context;
    }


    public async Task<Models.User> GetUserById(int id)
    {
        Models.User? user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);

        if (user is null)
            throw Errors.KeyNotFound("user", "id", id);

        return user;
    }

    public async Task<Models.User> CreateUser(UserCreateDTO createDTO)
    {
        var now = DateTime.Now;
        var registrationDate = new DateOnly(now.Year, now.Month, now.Day);
        int positionId = 2;

        var newUser = _context.CreateProxy<Models.User>();

        newUser.Login = createDTO.Login;
        newUser.Password = string.Empty;
        newUser.PositionId = positionId;
        newUser.Email = createDTO.Email;
        newUser.FirstName = createDTO.FirstName;
        newUser.LastName = createDTO.LastName;
        newUser.RegistrationDate = registrationDate;

        await _context.Users.AddAsync(newUser);
        await _context.SaveChangesAsync();

        await ChangeUserPassword(newUser.Id, createDTO.Password);

        return newUser;
    }

    public async Task<Models.User?> AuthenticateUser(UserAuthenticateDTO authenticateDTO)
    {
        string login = authenticateDTO.Login;
        string password = authenticateDTO.Password;

        Models.User? user = await _context.Users.FirstOrDefaultAsync(u => u.Login == login);

        if (user is null || !(await IsPasswordCorrect(user.Id, password)))
            return null;

        return user;
    }

    public async Task<bool> IsPasswordCorrect(int userId, string password)
    {
        Models.User user = await GetUserById(userId);
        return IsPasswordCorrect(user, password);
    }

    public async Task<bool> IsEmailUnique(string email)
    {
        bool isEmailInSystem = await _context.Users.AnyAsync(u => u.Email == email);
        return !isEmailInSystem;
    }

    public async Task<bool> IsLoginUnique(string login)
    {
        bool isLoginInSystem = await _context.Users.AnyAsync(u => u.Login == login);
        return !isLoginInSystem;
    }

    public async Task UpdateUser(UserUpdateDTO updateDTO)
    {
        Models.User user = await GetUserById(updateDTO.Id);

        if (user.Login != updateDTO.Login)
            if (!(await IsLoginUnique(updateDTO.Login)))
                throw Errors.Duplicate("login");

        if (user.Email != updateDTO.Email)
            if (!(await IsEmailUnique(updateDTO.Email)))
                throw Errors.Duplicate("email");
        
        user.Email = updateDTO.Email;
        user.Login = updateDTO.Login;
        user.FirstName = updateDTO.FirstName;
        user.LastName = updateDTO.LastName;

        await _context.SaveChangesAsync();
    }

    public async Task ChangeUserPassword(int userId, string newPassword)
    {
        Models.User user = await GetUserById(userId);

        newPassword = ConvertToHash(newPassword, userId);
        user.Password = newPassword;

        await _context.SaveChangesAsync();
    }

    private bool IsPasswordCorrect(Models.User user, string password)
    {
        string passwordHash = ConvertToHash(password, user.Id);
        return user.Password == passwordHash;
    }

    private string ConvertToHash(string password, int userId)
    {
        try
        {
            byte[] salt = GenerateSaltByUserId(userId);
            string result = HashPasswordArgon2(password, salt);
            return result;

        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }

    private string HashPasswordArgon2(string password, byte[] salt)
    {
        var argon2 = new Argon2id(Encoding.UTF8.GetBytes(password))
        {
            Salt = salt,
            DegreeOfParallelism = 4,
            MemorySize = 1024 * 64,
            Iterations = 4
        };

        byte[] hashBytes = argon2.GetBytes(32);
        return Convert.ToBase64String(hashBytes);
    }

    private byte[] GenerateSaltByUserId(int userId)
    {
        var userIdStr = userId.ToString();

        using (SHA256 sha256 = SHA256.Create())
        {
            byte[] userIdBytes = Encoding.UTF8.GetBytes(userIdStr);
            byte[] fullHash = sha256.ComputeHash(userIdBytes);

            var salt = new byte[_saltLength];
            Array.Copy(fullHash, salt, _saltLength);

            return salt;
        }
    }
}
