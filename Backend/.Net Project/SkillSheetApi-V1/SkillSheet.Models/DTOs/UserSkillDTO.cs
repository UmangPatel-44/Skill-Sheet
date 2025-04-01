namespace SkillSheet.Models.DTOs
{
    public class UserSkillDTO
    {
        public int UserSkillId { get; set; }
        public int UserId { get; set; }
        public int SkillId { get; set; }
        public string SkillName { get; set; }
        public string Category { get; set; }
        public double? Experience { get; set; }
        public DateOnly? DateAdded { get; set; }
    }

    
}
