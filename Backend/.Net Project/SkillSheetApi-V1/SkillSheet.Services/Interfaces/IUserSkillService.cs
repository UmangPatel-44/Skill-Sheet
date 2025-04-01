using DataAccess.Entities;
using SkillSheet.Models.DTOs;

namespace SkillSheet.Services.Interfaces
{
    public interface IUserSkillService
    {
        Task<IEnumerable<UserSkillDTO>> GetUserSkillsAsync(int userId);
        Task AddUserSkillAsync(UserSkillDTO userSkillDTO);
        Task<bool> DeleteUserSkillAsync(int id);
    }

}
