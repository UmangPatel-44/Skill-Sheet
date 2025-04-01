using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using SkillSheet.Models.DTOs;
using SkillSheet.Services.Interfaces;
using SkillSheet.WebApi;
namespace SkillSheet.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserSkillController : ControllerBase
    {
        private readonly IUserSkillService _userSkillService;

        public UserSkillController(IUserSkillService userSkillService)
        {
            _userSkillService = userSkillService;
        }
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUserSkills(int userId)
        {
            var id = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            if (userId != id)
            {
                return BadRequest(error: "Please Enter the Login Id only");
            }

            var skills = await _userSkillService.GetUserSkillsAsync(userId);
            return Ok(skills);
        }
        [HttpPost]
        public async Task<IActionResult> AddUserSkill([FromBody] UserSkillDTO userSkillDTO)
        {
            await _userSkillService.AddUserSkillAsync(userSkillDTO);
            return CreatedAtAction(nameof(GetUserSkills), new { userId = userSkillDTO.UserId }, userSkillDTO);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserSkill(int id)
        {
            var result = await _userSkillService.DeleteUserSkillAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}