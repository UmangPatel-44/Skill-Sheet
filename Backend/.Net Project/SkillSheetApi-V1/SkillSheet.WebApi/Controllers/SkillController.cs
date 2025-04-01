using Microsoft.AspNetCore.Mvc;
using SkillSheet.Models.DTOs;
using SkillSheet.Services.Interfaces;
namespace SkillSheet.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SkillController : ControllerBase
    {
        private readonly ISkillService _skillService;

        public SkillController(ISkillService skillService)
        {
            _skillService = skillService;
        }
        /// <summary>
        /// This Get Request returns the All The Skill List
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetAllSkills()
        {
            var skills = await _skillService.GetAllSkillsAsync();
            return Ok(skills);
        }
        /// <summary>
        /// This Get request returns the Skill According to the Category
        /// </summary>
        /// <param name="category"></param>
        /// <returns></returns>
        [HttpGet("category")]
        public async Task<IActionResult> GetSkillsByCategory([FromQuery] string category)
        {
            var skillList = await _skillService.GetSkillByCategory(category);
            return Ok(skillList);
        }
        /// <summary>
        /// This Get Request returns the Category List
        /// </summary>
        /// <returns></returns>
        [HttpGet("categories")]
        public async Task<IActionResult> GetCategory()
        {
            var categoryList = await _skillService.GetCategory();
            return Ok(categoryList);
        }
    }
}