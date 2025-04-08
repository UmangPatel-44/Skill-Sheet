using Microsoft.AspNetCore.Mvc;
using SkillSheet.Models.DTOs;
using SkillSheet.Services.Interfaces;
using SkillSheet.WebApi.Resources;
using System.Reflection;
using System.Threading.Tasks;

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
            try
            {
                var token = await _authService.AuthenticateAsync(loginDto);

                if (token == null)
                {
                    return Unauthorized(new { message = ErrorMessages.InvalidCredentials }); //ErrorMessage.InvalidCredential
                }

                return Ok(new { Token = token });
            }
            catch (Exception ex)
            {
                // Log the exception (you can use a logging framework here)
                Console.WriteLine(ErrorMessages.ErrorOccured+ex.Message);

                // Return a generic error response
                return StatusCode(500, new { message = ErrorMessages.ErrrorWhileProccessing });
            }
        }
    }
}
