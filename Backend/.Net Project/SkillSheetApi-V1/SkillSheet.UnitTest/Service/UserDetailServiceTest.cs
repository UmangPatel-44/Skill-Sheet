using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using SkillSheet.Services.Interfaces;
using SkillSheet.Models.DTOs;
using System.Security.Claims;
using System.Threading.Tasks;
using DataAccess.Entities;
using SkillSheet.WebApi.Controllers;

namespace SkillSheet.UnitTest.Controller
{
    public class UserDetailControllerTest
    {
        private readonly Mock<IUserDetailService> _mockUserDetailService;
        private readonly UserDetailController _userDetailController;

        public UserDetailControllerTest()
        {
            _mockUserDetailService = new Mock<IUserDetailService>();
            _userDetailController = new UserDetailController(_mockUserDetailService.Object);

            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, "1"),
                new Claim(ClaimTypes.Role, "User")
            }, "mock"));

            _userDetailController.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };
        }

        [Fact]
        public async Task GetUserDetail_ReturnsOk_WhenUserDetailsExist()
        {
            // Arrange
            var userDetails = new UserDetailDTO {UserId = 1 };
            _mockUserDetailService.Setup(service => service.GetUserDetailByUserIdAsync(1)).ReturnsAsync(userDetails);

            // Act
            var result = await _userDetailController.GetUserDetail();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<UserDetailDTO>(okResult.Value);
            Assert.Equal(userDetails.UserId, returnValue.UserId);
        }

        [Fact]
        public async Task GetUserDetail_ReturnsNotFound_WhenUserDetailsDoNotExist()
        {
            // Arrange
            _mockUserDetailService.Setup(service => service.GetUserDetailByUserIdAsync(1)).ReturnsAsync((UserDetailDTO)null);

            // Act
            var result = await _userDetailController.GetUserDetail();

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal("{ message = User details not found }", notFoundResult.Value.ToString());
        }

        [Fact]
        public async Task AddUserDetails_ReturnsOk_WhenModelStateIsValid()
        {
            // Arrange
            var userDetailDTO = new UserDetailDTO { UserId = 1 };
            var userDetail = new UserDetail { UserId = 1 };
            _mockUserDetailService.Setup(service => service.AddUserDetailsAsync(It.IsAny<UserDetailDTO>())).ReturnsAsync(userDetail);

            // Act
            var result = await _userDetailController.AddUserDetails(userDetailDTO);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<UserDetail>(okResult.Value);
            Assert.Equal(userDetailDTO.UserId, returnValue.UserId);
        }


        [Fact]
        public async Task AddUserDetails_ReturnsBadRequest_WhenModelStateIsInvalid()
        {
            // Arrange
            _userDetailController.ModelState.AddModelError("FirstName", "Required");

            // Act
            var result = await _userDetailController.AddUserDetails(new UserDetailDTO());

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.IsType<SerializableError>(badRequestResult.Value);
        }

        [Fact]
        public async Task UpdateUserDetail_ReturnsNoContent_WhenUpdateIsSuccessful()
        {
            // Arrange
            var userDetailDTO = new UserDetailDTO {UserId = 1 };
            _mockUserDetailService.Setup(service => service.UpdateUserDetailAsync(1, userDetailDTO)).ReturnsAsync(true);

            // Act
            var result = await _userDetailController.UpdateUserDetail(userDetailDTO);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }
        [Fact]
        public async Task UpdateUserDetail_ReturnsBadRequest_WhenUpdateFails()
        {
            // Arrange
            var userDetailDTO = new UserDetailDTO { UserId = 1 };
            _mockUserDetailService.Setup(service => service.UpdateUserDetailAsync(1, userDetailDTO)).ReturnsAsync(false);

            // Act
            var result = await _userDetailController.UpdateUserDetail(userDetailDTO);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            var actualValue = badRequestResult.Value as Dictionary<string, string>;
            Assert.NotNull(actualValue);
            Assert.Equal("Failed to update details", actualValue["message"]);
        }


        [Fact]
        public async Task UploadProfilePhoto_ReturnsBadRequest_WhenPhotoIsInvalid()
        {
            // Act
            var result = await _userDetailController.UploadProfilePhoto(null);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            var returnValue = badRequestResult.Value;
            Assert.False((bool)returnValue.GetType().GetProperty("success").GetValue(returnValue, null));
            Assert.Equal("Invalid file.", returnValue.GetType().GetProperty("message").GetValue(returnValue, null));
        }


        [Fact]
        public async Task GetProfilePhoto_ReturnsOk_WhenPhotoExists()
        {
            // Arrange
            var userDetails = new UserDetailDTO { UserId = 1, PhotoPath = "path/to/photo.jpg" };
            _mockUserDetailService.Setup(service => service.GetUserDetailByUserIdAsync(1)).ReturnsAsync(userDetails);

            // Act
            var result = await _userDetailController.GetProfilePhoto();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = okResult.Value;
            Assert.NotNull(returnValue);
            Assert.Equal("path/to/photo.jpg", returnValue.GetType().GetProperty("photoUrl")?.GetValue(returnValue, null));
        }


        [Fact]
        public async Task GetProfilePhoto_ReturnsNotFound_WhenPhotoDoesNotExist()
        {
            // Arrange
            var userDetails = new UserDetailDTO { UserId = 1, PhotoPath = null };
            _mockUserDetailService.Setup(service => service.GetUserDetailByUserIdAsync(1)).ReturnsAsync(userDetails);

            // Act
            var result = await _userDetailController.GetProfilePhoto();

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            var returnValue = Assert.IsType<Dictionary<string, string>>(notFoundResult.Value);
            Assert.Equal("Profile photo not found", returnValue["message"]);
        }






    }
}

