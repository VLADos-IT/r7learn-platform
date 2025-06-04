using System.ComponentModel.DataAnnotations;
using R7L.Models;

namespace R7L.DTO.User;

public class UserAuthenticateDTO
{
    [Required]
    public string Login { get; set; }

    [Required]
    public string Password { get; set; }
}
