using DataAccess.Entities;


namespace DataAccess.Repositories.Interfaces
{
    public interface IUserSkillRepository
    {
        Task<IEnumerable<UserSkill>> GetByUserIdAsync(int userId);
        Task AddAsync(UserSkill userSkill);
        Task<bool> DeleteAsync(int id);
    }


}
