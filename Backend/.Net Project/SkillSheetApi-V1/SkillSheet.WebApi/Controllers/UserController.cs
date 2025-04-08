using Microsoft.AspNetCore.Mvc;
using DataAccess.Entities;
using SkillSheet.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using SkillSheet.Models.DTOs;
using SkillSheet.WebApi.Resources;



namespace SkillSheet.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        #region Operations which can only done by Admin
        /// <summary>
        /// This Function is used to Update the User Information by fetching User from his email
        /// </summary>
        /// <param name="email"></param>
        /// <param name="adminViewDTO">Updated Data</param>
        /// <returns></returns>
        [HttpPut("email/{email}")]
        [Authorize(Roles ="Admin")]
        public async Task<ActionResult> ChangeAdminView(string email, [FromBody] ChangeAdminViewDTO adminViewDTO)
        {
            if (email != adminViewDTO.Email)
            {
                return BadRequest(new { message = GeneralResource.EmailMissmatch });
            }
            var success = await _userService.ChangeAdminViewAsync(adminViewDTO);
            if (!success)
            {
                return NotFound(new { message = GeneralResource.UserNotFound });
            }
            return NoContent();
        }
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddUser([FromBody] CreateUserDTO userDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var createdUser = await _userService.AddUserAsync(userDTO);
            return CreatedAtAction(nameof(GetUserById), new { id = createdUser.UserId }, createdUser);
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<AdminViewDTO>>> GetAllUsers()
        {
            var users = await _userService.GetUserListAsync();

            return Ok(users);
        }


        // GET: api/user/{id}
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<User>> GetUserById(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound(new { message = GeneralResource.UserNotFound });
            }
            return Ok(user);
        }
        #endregion

        [Authorize]
        [HttpGet("profile")]
        public async Task<IActionResult> GetUserProfile()   //When user Login it fetches the user data
        {
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value; // Get the logged-in user's email
            var user = await _userService.GetUserByEmailAsync(userEmail);

            if (user == null)
                return NotFound(GeneralResource.UserNotFound);

            return Ok(user);
        }

        // GET: api/user/email/{email}
        [HttpGet("email/{email}")]
        public async Task<ActionResult<User>> GetUserByEmail(string email)
        {
            var user = await _userService.GetUserByEmailAsync(email);
            if (user == null)
            {
                return NotFound(new { message = GeneralResource.UserNotFound });
            }
            return Ok(user);
        }

        // DELETE: api/user/{id}
        [HttpDelete("{email}")]
        public async Task<ActionResult> DeleteUser(string email)
        {
            var success = await _userService.DeleteUserAsync(email);
            if (!success)
            {
                return NotFound(new { message = GeneralResource.UserNotFound });
            }

            return NoContent();
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsersByRole([FromQuery]string role)
        {
            var users = await _userService.GetUsersByRole(role);
            return Ok(users);
        }

         [HttpPut("changePassword/{email}")]
         public async Task<ActionResult> ChangePassword(string email, [FromBody] ChangePasswordDTO changePasswordDTO)
         {
             if (changePasswordDTO.Email != email)
             {
                 return BadRequest(new { message = GeneralResource.EmailMissmatch });
             }
             var success = await _userService.ChangePasswordAsync(changePasswordDTO);
             if (!success)
             {
                 return NotFound(new { message = GeneralResource.UserNotFound });
             }

             return NoContent();
         }
        
        
    }
}
