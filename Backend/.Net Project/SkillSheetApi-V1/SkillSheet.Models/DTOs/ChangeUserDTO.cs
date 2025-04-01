namespace SkillSheet.Models.DTOs
{
    public class ChangeUserDTO
    {
        public int UserId { get; set; }  // Ensure proper casing (UserId, not UserId)
        public string Name { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
