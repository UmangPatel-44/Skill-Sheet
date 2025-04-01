namespace SkillSheet.Models.DTOs
{
    public class UserDetailDTO
    {
        public int UserId { get; set; }
        public string Gender { get; set; }
        public DateOnly BirthDate { get; set; }
        public DateOnly JoiningDate { get; set; }
        public string Qualifications { get; set; }
        public bool WorkedInJapan { get; set; }
        public string PhotoPath { get; set; }
    }
}
