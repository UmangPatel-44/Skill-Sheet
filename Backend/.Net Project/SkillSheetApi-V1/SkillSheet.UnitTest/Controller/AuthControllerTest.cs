using Xunit;
using Moq;
using SkillSheet.Services.Interfaces;
using SkillSheet.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using SkillSheet.WebApi.Controllers;

namespace SkillSheet.UnitTest.Controller
{
    public class AuthControllerTests
    {
        private readonly Mock<IAuthService> _mockAuthService;
        private readonly AuthController _authController;

        public AuthControllerTests()
        {
            _mockAuthService = new Mock<IAuthService>();
            _authController = new AuthController(_mockAuthService.Object);
        }

        [Fact]
        public async Task Login_ReturnsOk_WhenCredentialsAreValid()
        {
            // Arrange
            var loginDto = new LoginDto { Email = "test@example.com", Password = "password" };
            var token = "valid_token";
            _mockAuthService.Setup(service => service.AuthenticateAsync(loginDto)).ReturnsAsync(token);

            // Act
            var result = await _authController.Login(loginDto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = okResult.Value;
            var tokenValue = returnValue.GetType().GetProperty("Token").GetValue(returnValue, null);
            Assert.Equal(token, tokenValue);
        }

        [Fact]
        public async Task Login_ReturnsUnauthorized_WhenCredentialsAreInvalid()
        {
            // Arrange
            var loginDto = new LoginDto { Email = "test@example.com", Password = "wrong_password" };
            _mockAuthService.Setup(service => service.AuthenticateAsync(loginDto)).ReturnsAsync((string)null);

            // Act
            var result = await _authController.Login(loginDto);

            // Assert
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
            var returnValue = unauthorizedResult.Value;
            var message = returnValue.GetType().GetProperty("message").GetValue(returnValue, null);
            Assert.Equal("Invalid credentials", message);
        }
    }
}
