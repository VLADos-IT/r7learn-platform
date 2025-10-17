using System.ComponentModel.DataAnnotations;

namespace R7L.DTO.User;

public class UserUpdateDTO
{
    [Required]
    public int Id { get; set; }

    [Required]
    [MaxLength(25)]
    public string Login { get; set; }

    [Required]
    [MaxLength(120)]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    [MaxLength(20)]
    public string FirstName { get; set; }

    [Required]
    [MaxLength(20)]
    public string LastName { get; set; }
}
