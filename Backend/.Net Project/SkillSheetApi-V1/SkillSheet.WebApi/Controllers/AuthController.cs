using Microsoft.AspNetCore.Mvc;
using SkillSheet.Models.DTOs;
using SkillSheet.Services.Interfaces;
using System.Reflection;
using System.Threading.Tasks;
//using SkillSheet.WebApi.Resources;
namespace SkillSheet.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }
        /// <summary>
        /// This Request is for Login Where User enters his Credential and if Yes then User is Logged in According to his Role
        /// </summary>
        /// <param name="loginDto">Contains Fields like (Role,User Email, Password)</param>
        /// <returns></returns>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var token = await _authService.AuthenticateAsync(loginDto);

            if (token == null)
            {
                return Unauthorized(new { message ="Invalid Credintials" });   //ErrorMessage.InvalidCredential
            }

            return Ok(new { Token = token });
        }
    }
}
