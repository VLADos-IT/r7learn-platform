using System.ComponentModel.DataAnnotations;
using R7L.Models;

namespace R7L.DTO.User;

public class UserUniqueInfoDTO
{
    [Required]
    public string Login { get; set; }

    [Required]
    public string Email { get; set; }
}
