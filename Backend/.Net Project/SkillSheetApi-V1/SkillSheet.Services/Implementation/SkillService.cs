using DataAccess.Entities;
using SkillSheet.Models.DTOs;
using DataAccess.Repositories.Interfaces;
using SkillSheet.Services.Interfaces;

namespace SkillSheet.Services.Implementation
{
    public class SkillService : ISkillService
    {
        private readonly ISkillRepository _skillRepository;

        public SkillService(ISkillRepository skillRepository)
        {
            _skillRepository = skillRepository;
        }

        public async Task<IEnumerable<SkillDTO>> GetAllSkillsAsync()
        {
            try
            {
                var skills = await _skillRepository.GetAllAsync();
                return skills.Select(s => new SkillDTO
                {
                    SkillId = s.SkillId,
                    SkillName = s.SkillName,
                    Category = s.Category
                });
            }
            catch (Exception ex) { throw new Exception(ex.Message); }
        }



        public async Task<IEnumerable<SkillDTO>> GetSkillByCategory(string category)
        {
            try
            {
                var skillList = await _skillRepository.GetSkillByCategory(category);
                var skillDtoList = skillList.Select(s => new SkillDTO
                {
                    SkillId = s.SkillId,
                    SkillName = s.SkillName,
                    Category = s.Category
                });
                return skillDtoList;
            }
            catch (Exception ex) { throw new Exception(ex.Message); }
        }

        public async Task<IEnumerable<string>> GetCategory()
        {
            try
            {
                var CategoryList = await _skillRepository.GetCategory();

                return CategoryList;
            }
            catch (Exception ex) { throw new Exception(ex.Message); }
        }
    }

}
