using Xunit;
using Moq;
using SkillSheet.WebApi.Controllers;
using SkillSheet.Services.Interfaces;
using SkillSheet.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using DataAccess.Entities;
using Microsoft.EntityFrameworkCore.InMemory.Query.Internal;
using Newtonsoft.Json;
using SkillSheet.WebApi.Controllers;

namespace SkillSheet.UnitTest.Controller
{
    public class UserDetailControllerTests
    {
        private readonly Mock<IUserDetailService> _mockUserDetailService;
        private readonly UserDetailController _userDetailController;

        public UserDetailControllerTests()
        {
            _mockUserDetailService = new Mock<IUserDetailService>();
            _userDetailController = new UserDetailController(_mockUserDetailService.Object);

            // Mocking the HttpContext for User Claims
            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                    new Claim(ClaimTypes.NameIdentifier, "1")
            }, "mock"));

            _userDetailController.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };
        }

        [Fact]
        public async Task GetUserDetail_ReturnsOk_WhenUserDetailExists()
        {
            // Arrange
            var userId = 1;
            var userDetail = new UserDetailDTO { UserId = userId };
            _mockUserDetailService.Setup(service => service.GetUserDetailByUserIdAsync(userId)).ReturnsAsync(userDetail);

            // Act
            var result = await _userDetailController.GetUserDetail();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(userDetail, okResult.Value);
        }

        [Fact]
        public async Task GetUserDetail_ReturnsNotFound_WhenUserDetailDoesNotExist()
        {
            // Arrange
            var userId = 1;
            _mockUserDetailService.Setup(service => service.GetUserDetailByUserIdAsync(userId)).ReturnsAsync((UserDetailDTO)null);

            // Act
            var result = await _userDetailController.GetUserDetail();

            // Assert
            Assert.IsType<NotFoundObjectResult>(result);
        }

        [Fact]
        public async Task AddUserDetails_ReturnsOk_WhenUserDetailsAreAdded()
        {
            // Arrange
            var userDetailDTO = new UserDetailDTO { UserId = 1 };
            var userDetail = new UserDetail { UserId = 1 }; // Assuming UserDetail is a different class
            _mockUserDetailService.Setup(service => service.AddUserDetailsAsync(userDetailDTO)).ReturnsAsync(userDetail);

            // Act
            var result = await _userDetailController.AddUserDetails(userDetailDTO);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(userDetail, okResult.Value);
        }

        [Fact]
        public async Task AddUserDetails_ReturnsBadRequest_WhenModelStateIsInvalid()
        {
            // Arrange
            _userDetailController.ModelState.AddModelError("Name", "Required");

            // Act
            var result = await _userDetailController.AddUserDetails(new UserDetailDTO());

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task UpdateUserDetail_ReturnsNoContent_WhenUpdateIsSuccessful()
        {
            // Arrange
            var userDetailDTO = new UserDetailDTO { UserId = 1 };
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
            Assert.NotNull(result); // Ensure result is not null
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            var badRequestValue = badRequestResult.Value;
            Assert.NotNull(badRequestValue); // Ensure badRequestValue is not null
            Assert.Equal("Failed to update details", badRequestValue.GetType().GetProperty("message").GetValue(badRequestValue, null).ToString());
        }



        [Fact]
        public async Task UploadProfilePhoto_ReturnsOk_WhenUploadIsSuccessful()
        {
            // Arrange
            var photoMock = new Mock<IFormFile>();
            var photoName = "test.jpg";
            var ms = new MemoryStream();
            var writer = new StreamWriter(ms);
            writer.Write("Dummy file content");
            writer.Flush();
            ms.Position = 0;

            photoMock.Setup(_ => _.OpenReadStream()).Returns(ms);
            photoMock.Setup(_ => _.FileName).Returns(photoName);
            photoMock.Setup(_ => _.Length).Returns(ms.Length);

            _mockUserDetailService.Setup(service => service.UpdateProfilePhotoAsync(1, photoMock.Object)).ReturnsAsync("path/to/photo.jpg");

            // Act
            var result = await _userDetailController.UploadProfilePhoto(photoMock.Object);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = okResult.Value;
            var success = returnValue.GetType().GetProperty("success").GetValue(returnValue, null);
            var photoPath = returnValue.GetType().GetProperty("photoPath").GetValue(returnValue, null);
            Assert.True((bool)success);
            Assert.Equal("path/to/photo.jpg", photoPath);
        }


        [Fact]
        public async Task UploadProfilePhoto_ReturnsBadRequest_WhenPhotoIsInvalid()
        {
            // Act
            var result = await _userDetailController.UploadProfilePhoto(null);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            var returnValue = badRequestResult.Value;

            Assert.NotNull(returnValue);
            var success = returnValue.GetType().GetProperty("success").GetValue(returnValue, null);
            var message = returnValue.GetType().GetProperty("message").GetValue(returnValue, null);

            Assert.False((bool)success);
            Assert.Equal("Invalid file.", message);
        }


        [Fact]
        public async Task GetProfilePhoto_ReturnsOk_WhenPhotoExists()
        {
            // Arrange
            var userDetail = new UserDetailDTO { UserId = 1, PhotoPath = "path/to/photo.jpg" };
            _mockUserDetailService.Setup(service => service.GetUserDetailByUserIdAsync(1)).ReturnsAsync(userDetail);

            // Act
            var result = await _userDetailController.GetProfilePhoto();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = okResult.Value;
            var photoUrl = returnValue.GetType().GetProperty("photoUrl").GetValue(returnValue, null).ToString();
            Assert.Equal("path/to/photo.jpg", photoUrl);
        }


        [Fact]
        public async Task GetProfilePhoto_ReturnsNotFound_WhenPhotoDoesNotExist()
        {
            // Arrange
            var userDetail = new UserDetailDTO { UserId = 1, PhotoPath = null };
            _mockUserDetailService.Setup(service => service.GetUserDetailByUserIdAsync(1)).ReturnsAsync(userDetail);

            // Act
            var result = await _userDetailController.GetProfilePhoto();

            // Assert
            Assert.IsType<NotFoundObjectResult>(result);
        }
    }
}
