using DataAccess.Entities;
using SkillSheet.Models.DTOs;
using DataAccess.Repositories.Interfaces;
using SkillSheet.Services.Interfaces;
namespace SkillSheet.Services.Implementation
{
    public class UserSkillService : IUserSkillService
    {
        private readonly IUserSkillRepository _userSkillRepository;

        public UserSkillService(IUserSkillRepository userSkillRepository)
        {
            _userSkillRepository = userSkillRepository;
        }

        public async Task<IEnumerable<UserSkillDTO>> GetUserSkillsAsync(int userId)
        {
            try
            {
                var userSkills = await _userSkillRepository.GetByUserIdAsync(userId);
                var userSkillDtos = userSkills.Select(userSkill => new UserSkillDTO
                {
                    UserSkillId = userSkill.UserSkillId,
                    UserId = userSkill.UserId,
                    SkillId = userSkill.SkillId,
                    SkillName = userSkill.Skill?.SkillName ?? "Not Found",
                    Category = userSkill.Skill?.Category ?? "Not Found",
                    Experience = userSkill.Experience,
                    DateAdded = userSkill.DateAdded
                });
                return userSkillDtos;
            }
            catch (Exception ex) { throw new Exception(ex.Message); }
        }

        public async Task AddUserSkillAsync(UserSkillDTO userSkillDTO)
        {
            try{var userSkill = new UserSkill
            {
                UserId = userSkillDTO.UserId,
                SkillId = userSkillDTO.SkillId,
                Experience = userSkillDTO.Experience,
                DateAdded = userSkillDTO.DateAdded
            };

                await _userSkillRepository.AddAsync(userSkill);
            }
            catch(Exception ex) { throw new Exception(ex.Message); }
        }

        public async Task<bool> DeleteUserSkillAsync(int id)
        {
            try { return await _userSkillRepository.DeleteAsync(id); }
            catch (Exception ex) { throw new Exception(ex.Message); }
        }
    }
}