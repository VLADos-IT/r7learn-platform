using System.ComponentModel.DataAnnotations;
using R7L.Models;

namespace R7L.DTO.User;

public class UserChangePasswordDTO
{
    [Required]
    public string OldPassword { get; set; }
    
    [Required]
    public string NewPassword { get; set; }
}
