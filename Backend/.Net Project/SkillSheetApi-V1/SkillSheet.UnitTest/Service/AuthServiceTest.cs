using Xunit;
using Moq;
using SkillSheet.Services.Implementation;
using SkillSheet.Services.Interfaces;
using SkillSheet.Models.DTOs;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using DataAccess.Entities;
using System.Collections.Generic;
using DataAccess.Repositories.Interfaces;

namespace SkillSheet.UnitTest.Service
{
    public class AuthServiceTest
    {
        private readonly Mock<IUserRepository> _mockUserRepository;
        private readonly Mock<IConfiguration> _mockConfiguration;
        private readonly AuthService _authService;

        public AuthServiceTest()
        {
            _mockUserRepository = new Mock<IUserRepository>();
            _mockConfiguration = new Mock<IConfiguration>();

            var inMemorySettings = new Dictionary<string, string> {
                {"JwtSettings:Secret", "a2VnZW4uMTIzdXNlcm5hbWU5OmtleS42UHdodjM1OTAxQXZMZ29kZQ=="},
                {"JwtSettings:ExpirationMinutes", "60"},
                {"JwtSettings:Issuer", "testIssuer"},
                {"JwtSettings:Audience", "testAudience"}
            };

            _mockConfiguration.Setup(c => c[It.IsAny<string>()]).Returns((string key) => inMemorySettings[key]);

            _authService = new AuthService(_mockUserRepository.Object, _mockConfiguration.Object);
        }

        [Fact]
        public async Task AuthenticateAsync_ReturnsToken_WhenCredentialsAreValid()
        {
            // Arrange
            var loginDto = new LoginDto { Email = "test@example.com", Password = "password", Role = "User" };
            var user = new User { UserId = 1, Email = "test@example.com", Password = BCrypt.Net.BCrypt.HashPassword("password"), Role = "User" };

            _mockUserRepository.Setup(repo => repo.GetUserByEmailAsync(loginDto.Email)).ReturnsAsync(user);

            // Act
            var token = await _authService.AuthenticateAsync(loginDto);

            // Assert
            Assert.NotNull(token);
        }

        [Fact]
        public async Task AuthenticateAsync_ReturnsNull_WhenUserDoesNotExist()
        {
            // Arrange
            var loginDto = new LoginDto { Email = "nonexistent@example.com", Password = "password", Role = "User" };

            _mockUserRepository.Setup(repo => repo.GetUserByEmailAsync(loginDto.Email)).ReturnsAsync((User)null);

            // Act
            var token = await _authService.AuthenticateAsync(loginDto);

            // Assert
            Assert.Null(token);
        }

        [Fact]
        public async Task AuthenticateAsync_ReturnsNull_WhenPasswordIsInvalid()
        {
            // Arrange
            var loginDto = new LoginDto { Email = "test@example.com", Password = "wrongpassword", Role = "User" };
            var user = new User { UserId = 1, Email = "test@example.com", Password = BCrypt.Net.BCrypt.HashPassword("password"), Role = "User" };

            _mockUserRepository.Setup(repo => repo.GetUserByEmailAsync(loginDto.Email)).ReturnsAsync(user);

            // Act
            var token = await _authService.AuthenticateAsync(loginDto);

            // Assert
            Assert.Null(token);
        }

        [Fact]
        public async Task AuthenticateAsync_ReturnsNull_WhenRoleIsInvalid()
        {
            // Arrange
            var loginDto = new LoginDto { Email = "test@example.com", Password = "password", Role = "Admin" };
            var user = new User { UserId = 1, Email = "test@example.com", Password = BCrypt.Net.BCrypt.HashPassword("password"), Role = "User" };

            _mockUserRepository.Setup(repo => repo.GetUserByEmailAsync(loginDto.Email)).ReturnsAsync(user);

            // Act
            var token = await _authService.AuthenticateAsync(loginDto);

            // Assert
            Assert.Null(token);
        }
    }
}
