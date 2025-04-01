using Microsoft.AspNetCore.Http;

namespace SkillSheet.Models.DTOs
{
    public class ProfilePhotoUploadDTO
    {
        public IFormFile Photo { get; set; } 
    }
}
