using R7L.Models;

namespace R7L.DTO.User;

public class UserReadDTO
{
    public int Id { get; set; }

    public string Login { get; set; }

    public string PositionName { get; set; }

    public string Email { get; set; }

    public string FirstName { get; set; }

    public string LastName { get; set; }

    public DateOnly RegistrationDate { get; set; }


    public UserReadDTO(Models.User user)
    {
        Id = user.Id;
        Login = user.Login;
        PositionName = user.Position.Name;
        Email = user.Email;
        FirstName = user.FirstName;
        LastName = user.LastName;
        RegistrationDate = user.RegistrationDate;
    }
}
