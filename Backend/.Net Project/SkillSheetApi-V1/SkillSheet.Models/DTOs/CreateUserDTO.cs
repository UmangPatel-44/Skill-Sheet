using System.ComponentModel.DataAnnotations;

namespace SkillSheet.Models.DTOs
{
    public class CreateUserDTO
    {
        public string Name { get; set; } = null!; 
        public string Email { get; set; } = null!;
        public string Role { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}
