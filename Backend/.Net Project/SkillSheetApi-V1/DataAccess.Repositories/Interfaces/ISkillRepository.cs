using DataAccess.Entities;

namespace DataAccess.Repositories.Interfaces
{
    public interface ISkillRepository
    {
        Task<IEnumerable<Skill>> GetAllAsync();

        Task<IEnumerable<Skill>> GetSkillByCategory(string Category);
        Task<IEnumerable<string>> GetCategory();
    }

}
