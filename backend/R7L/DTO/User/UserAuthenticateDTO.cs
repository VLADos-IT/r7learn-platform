using System.ComponentModel.DataAnnotations;

namespace R7L.DTO.User;

public class UserAuthenticateDTO
{
    [Required]
    public string Login { get; set; }

    [Required]
    public string Password { get; set; }
}
