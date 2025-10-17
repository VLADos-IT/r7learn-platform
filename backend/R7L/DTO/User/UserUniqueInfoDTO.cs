using System.ComponentModel.DataAnnotations;

namespace R7L.DTO.User;

public class UserUniqueInfoDTO
{
    [Required]
    public string Login { get; set; }

    [Required]
    public string Email { get; set; }
}
