using Xunit;
using Moq;
using SkillSheet.Services.Interfaces;
using SkillSheet.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using DataAccess.Entities;
using System.Collections.Generic;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using SkillSheet.WebApi.Controllers;

namespace SkillSheet.UnitTest.Controller
{
    public class UserControllerTests
    {
        private readonly Mock<IUserService> _mockUserService;
        private readonly UserController _userController;

        public UserControllerTests()
        {
            _mockUserService = new Mock<IUserService>();
            _userController = new UserController(_mockUserService.Object);

            // Mocking the HttpContext for User Claims
            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.Email, "test@example.com")
            }, "mock"));

            _userController.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };
        }

        [Fact]
        public async Task GetUserById_ReturnsOk_WhenUserExists()
        {
            // Arrange
            var userId = 1;
            var user = new User { UserId = userId, Name = "Test User" };
            _mockUserService.Setup(service => service.GetUserByIdAsync(userId)).ReturnsAsync(user);

            // Act
            var result = await _userController.GetUserById(userId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equal(user, okResult.Value);
        }

        [Fact]
        public async Task GetUserById_ReturnsNotFound_WhenUserDoesNotExist()
        {
            // Arrange
            var userId = 1;
            _mockUserService.Setup(service => service.GetUserByIdAsync(userId)).ReturnsAsync((User)null);

            // Act
            var result = await _userController.GetUserById(userId);

            // Assert
            Assert.IsType<NotFoundObjectResult>(result.Result);
        }

        [Fact]
        public async Task GetUserProfile_ReturnsOk_WhenUserExists()
        {
            // Arrange
            var userEmail = "test@example.com";
            var user = new User { Email = userEmail, Name = "Test User" };
            _mockUserService.Setup(service => service.GetUserByEmailAsync(userEmail)).ReturnsAsync(user);

            // Act
            var result = await _userController.GetUserProfile();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(user, okResult.Value);
        }

        [Fact]
        public async Task GetUserProfile_ReturnsNotFound_WhenUserDoesNotExist()
        {
            // Arrange
            var userEmail = "test@example.com";
            _mockUserService.Setup(service => service.GetUserByEmailAsync(userEmail)).ReturnsAsync((User)null);

            // Act
            var result = await _userController.GetUserProfile();

            // Assert
            Assert.IsType<NotFoundObjectResult>(result);
        }

        [Fact]
        public async Task DeleteUser_ReturnsNoContent_WhenUserIsDeleted()
        {
            // Arrange
            var userEmail = "test@example.com";
            _mockUserService.Setup(service => service.DeleteUserAsync(userEmail)).ReturnsAsync(true);

            // Act
            var result = await _userController.DeleteUser(userEmail);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task DeleteUser_ReturnsNotFound_WhenUserDoesNotExist()
        {
            // Arrange
            var userEmail = "test@example.com";
            _mockUserService.Setup(service => service.DeleteUserAsync(userEmail)).ReturnsAsync(false);

            // Act
            var result = await _userController.DeleteUser(userEmail);

            // Assert
            Assert.IsType<NotFoundObjectResult>(result);
        }

        [Fact]
        public async Task GetUsersByRole_ReturnsOk_WithUsers()
        {
            // Arrange
            var role = "Admin";
            var users = new List<User> { new User { UserId = 1, Name = "Admin User" } };
            _mockUserService.Setup(service => service.GetUsersByRole(role)).ReturnsAsync(users);

            // Act
            var result = await _userController.GetUsersByRole(role);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(users, okResult.Value);
        }

        [Fact]
        public async Task GetAllUsers_ReturnsOk_WithUsers()
        {
            // Arrange
            var users = new List<AdminViewDTO> { new AdminViewDTO { UserId = 1, Name = "Admin User" } };
            _mockUserService.Setup(service => service.GetUserListAsync()).ReturnsAsync(users);

            // Act
            var result = await _userController.GetAllUsers();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equal(users, okResult.Value);
        }

        [Fact]
        public async Task ChangePassword_ReturnsNoContent_WhenPasswordIsChanged()
        {
            // Arrange
            var email = "test@example.com";
            var changePasswordDTO = new ChangePasswordDTO { Email = email, OldPassword = "oldPassword", NewPassword = "newPassword" };
            _mockUserService.Setup(service => service.ChangePasswordAsync(changePasswordDTO)).ReturnsAsync(true);

            // Act
            var result = await _userController.ChangePassword(email, changePasswordDTO);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]

        public async Task ChangePassword_ReturnsNotFound_WhenUserDoesNotExist()
        {
            // Arrange
            var email = "test@example.com";
            var changePasswordDTO = new ChangePasswordDTO { Email = email, OldPassword = "oldPassword", NewPassword = "newPassword" };
            _mockUserService.Setup(service => service.ChangePasswordAsync(changePasswordDTO)).ReturnsAsync(false);

            // Act
            var result = await _userController.ChangePassword(email, changePasswordDTO);

            // Assert
            Assert.IsType<NotFoundObjectResult>(result);
        }
    }
}
