using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkillSheet.Models.DTOs;
using SkillSheet.Services.Interfaces;
using SkillSheet.WebApi.Resources;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SkillSheet.WebApi.Controllers
{
    [Route("api/userdetails")]
    [ApiController]
    [Authorize(Roles = "User")]
    public class UserDetailController : ControllerBase
    {
        private readonly IUserDetailService _userDetailService;

        public UserDetailController(IUserDetailService userDetailService)
        {
            _userDetailService = userDetailService;
        }
        /// <summary>
        /// This Request gives the User Details of the User who is currently Logged In
        /// </summary>
        /// <returns></returns>
        [HttpGet("me")]
        public async Task<IActionResult> GetUserDetail()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            
            var userDetails = await _userDetailService.GetUserDetailByUserIdAsync(userId);

            if (userDetails == null)
                return NotFound(new { message = GeneralResource.UserDetailNotFound });

            return Ok(userDetails);
            }
        [HttpPost]
        public async Task<ActionResult> AddUserDetails([FromBody] UserDetailDTO userDetailDTO)
            {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var addDetails = await _userDetailService.AddUserDetailsAsync(userDetailDTO);
            return Ok(addDetails);
        }
    
        [HttpPut("me")]
        public async Task<IActionResult> UpdateUserDetail([FromBody] UserDetailDTO userDetailDto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            Console.WriteLine(userId);
            var success = await _userDetailService.UpdateUserDetailAsync(userId, userDetailDto);

            if (!success)
                return BadRequest(new Dictionary<string, string> { { "message", GeneralResource.DetailsUpdateFail } });

            return NoContent();
        }
        [HttpPost("upload-photo")]
        public async Task<IActionResult> UploadProfilePhoto(IFormFile photo)
        {
            if (photo == null || photo.Length == 0)
            {
                return BadRequest(new { success = false, message = GeneralResource.InvalidFile });
            }

            if (!int.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out int userId))
            {
                return Unauthorized(new { success = false, message = GeneralResource.UserNotAuthorised });
            }

            // Call service method, which now returns the photo path
            var photoPath = await _userDetailService.UpdateProfilePhotoAsync(userId, photo);

            if (string.IsNullOrEmpty(photoPath))
            {
                return BadRequest(new { success = false, message = GeneralResource.PhotoUploadFail });
            }

            return Ok(new { success = true, photoPath });
        }

        [HttpGet("me/photo")]
        public async Task<IActionResult> GetProfilePhoto()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var userDetails = await _userDetailService.GetUserDetailByUserIdAsync(userId);

            if (userDetails == null || string.IsNullOrEmpty(userDetails.PhotoPath))
            {
                return NotFound(new Dictionary<string, string> { { "message", GeneralResource.ProfilePhotoNotFound } });
            }

            // Return the photo URL
            return Ok(new { photoUrl = userDetails.PhotoPath });
        }

    }
}
