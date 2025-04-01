using SkillSheet.Models.DTOs;

namespace SkillSheet.Services.Interfaces
{
    public interface ISkillService
    {
        Task<IEnumerable<SkillDTO>> GetAllSkillsAsync();
        Task<IEnumerable<SkillDTO>> GetSkillByCategory(string category);
        Task<IEnumerable<string>> GetCategory();
    }

}
