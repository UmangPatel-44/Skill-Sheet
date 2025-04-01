using System.Collections.Generic;
using System.Threading.Tasks;
using Moq;
using SkillSheet.Services.Interfaces;
using SkillSheet.Services.Implementation;
using SkillSheet.Models.DTOs;
using DataAccess.Entities;
using Xunit;
using DataAccess.Repositories.Interfaces;

namespace SkillSheet.UnitTest.Service
{
    public class UserServiceTests
    {
        private readonly Mock<IUserRepository> _mockUserRepository;
        private readonly UserService _userService;

        public UserServiceTests()
        {
            _mockUserRepository = new Mock<IUserRepository>();
            _userService = new UserService(_mockUserRepository.Object);
        }

        [Fact]
        public async Task GetUserByIdAsync_ReturnsUser()
        {
            // Arrange
            var userId = 1;
            var user = new User { UserId = userId, Name = "Test User" };
            _mockUserRepository.Setup(repo => repo.GetUserByIdAsync(userId)).ReturnsAsync(user);

            // Act
            var result = await _userService.GetUserByIdAsync(userId);

            // Assert
            Assert.Equal(user, result);
        }

        [Fact]
        public async Task GetUserByEmailAsync_ReturnsUser()
        {
            // Arrange
            var email = "test@example.com";
            var user = new User { Email = email, Name = "Test User" };
            _mockUserRepository.Setup(repo => repo.GetUserByEmailAsync(email)).ReturnsAsync(user);

            // Act
            var result = await _userService.GetUserByEmailAsync(email);

            // Assert
            Assert.Equal(user, result);
        }

        [Fact]
        public async Task DeleteUserAsync_ReturnsTrue_WhenUserExists()
        {
            // Arrange
            var email = "test@example.com";
            var user = new User { Email = email, Name = "Test User" };
            _mockUserRepository.Setup(repo => repo.GetUserByEmailAsync(email)).ReturnsAsync(user);
            _mockUserRepository.Setup(repo => repo.DeleteUserAsync(email)).Returns(Task.CompletedTask);

            // Act
            var result = await _userService.DeleteUserAsync(email);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task DeleteUserAsync_ReturnsFalse_WhenUserDoesNotExist()
        {
            // Arrange
            var email = "test@example.com";
            _mockUserRepository.Setup(repo => repo.GetUserByEmailAsync(email)).ReturnsAsync((User)null);

            // Act
            var result = await _userService.DeleteUserAsync(email);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task GetUsersByRole_ReturnsUsers()
        {
            // Arrange
            var role = "Admin";
            var users = new List<User> { new User { Role = role, Name = "Admin User" } };
            _mockUserRepository.Setup(repo => repo.GetUserByRoleAsync(role)).ReturnsAsync(users);

            // Act
            var result = await _userService.GetUsersByRole(role);

            // Assert
            Assert.Equal(users, result);
        }

        [Fact]
        public async Task ChangeUserAsync_ReturnsTrue_WhenUserExists()
        {
            // Arrange
            var userDTO = new ChangeUserDTO { UserId = 1, Name = "Updated User", IsActive = true };
            var user = new User { UserId = userDTO.UserId, Name = "Test User" };
            _mockUserRepository.Setup(repo => repo.GetUserByIdAsync(userDTO.UserId)).ReturnsAsync(user);
            _mockUserRepository.Setup(repo => repo.ChangeUserAsync(user)).Returns(Task.CompletedTask);

            // Act
            var result = await _userService.ChangeUserAsync(userDTO);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task ChangeUserAsync_ReturnsFalse_WhenUserDoesNotExist()
        {
            // Arrange
            var userDTO = new ChangeUserDTO { UserId = 1, Name = "Updated User", IsActive = true };
            _mockUserRepository.Setup(repo => repo.GetUserByIdAsync(userDTO.UserId)).ReturnsAsync((User)null);

            // Act
            var result = await _userService.ChangeUserAsync(userDTO);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task GetUserListAsync_ReturnsUserList()
        {
            // Arrange
            var users = new List<User> { new User { UserId = 1, Name = "Test User", Email = "test@example.com", Password = "password" } };
            _mockUserRepository.Setup(repo => repo.GetUserListAsync()).ReturnsAsync(users);

            // Act
            var result = await _userService.GetUserListAsync();

            // Assert
            Assert.NotEmpty(result);
        }

        [Fact]
        public async Task AddUserAsync_ReturnsNewUser()
        {
            // Arrange
            var userDTO = new CreateUserDTO { Name = "New User", Email = "new@example.com", Password = "password" };
            var newUser = new User { Name = userDTO.Name, Email = userDTO.Email, Password = "hashedpassword" };
            _mockUserRepository.Setup(repo => repo.AddUserAsync(It.IsAny<User>())).ReturnsAsync(newUser);

            // Act
            var result = await _userService.AddUserAsync(userDTO);

            // Assert
            Assert.Equal(newUser, result);
        }

        [Fact]
        public async Task ChangeAdminViewAsync_ReturnsTrue_WhenUserExists()
        {
            // Arrange
            var adminViewDTO = new ChangeAdminViewDTO { Email = "admin@example.com", Name = "Admin User", Password = "newpassword" };
            var user = new User { Email = adminViewDTO.Email, Name = "Admin User", Password = "oldpassword" };
            _mockUserRepository.Setup(repo => repo.GetUserByEmailAsync(adminViewDTO.Email)).ReturnsAsync(user);
            _mockUserRepository.Setup(repo => repo.ChangeUserAsync(user)).Returns(Task.CompletedTask);

            // Act
            var result = await _userService.ChangeAdminViewAsync(adminViewDTO);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task ChangeAdminViewAsync_ReturnsFalse_WhenUserDoesNotExist()
        {
            // Arrange
            var adminViewDTO = new ChangeAdminViewDTO { Email = "admin@example.com", Name = "Admin User", Password = "newpassword" };
            _mockUserRepository.Setup(repo => repo.GetUserByEmailAsync(adminViewDTO.Email)).ReturnsAsync((User)null);

            // Act
            var result = await _userService.ChangeAdminViewAsync(adminViewDTO);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task ChangePasswordAsync_ReturnsTrue_WhenPasswordIsChanged()
        {
            // Arrange
            var changePasswordDTO = new ChangePasswordDTO { Email = "user@example.com", OldPassword = "oldpassword", NewPassword = "newpassword" };
            var user = new User { Email = changePasswordDTO.Email, Password = BCrypt.Net.BCrypt.HashPassword(changePasswordDTO.OldPassword) };
            _mockUserRepository.Setup(repo => repo.GetUserByEmailAsync(changePasswordDTO.Email)).ReturnsAsync(user);
            _mockUserRepository.Setup(repo => repo.ChangeUserAsync(user)).Returns(Task.CompletedTask);

            // Act
            var result = await _userService.ChangePasswordAsync(changePasswordDTO);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task ChangePasswordAsync_ReturnsFalse_WhenUserDoesNotExist()
        {
            // Arrange
            var changePasswordDTO = new ChangePasswordDTO { Email = "user@example.com", OldPassword = "oldpassword", NewPassword = "newpassword" };
            _mockUserRepository.Setup(repo => repo.GetUserByEmailAsync(changePasswordDTO.Email)).ReturnsAsync((User)null);

            // Act
            var result = await _userService.ChangePasswordAsync(changePasswordDTO);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task ChangePasswordAsync_ReturnsFalse_WhenOldPasswordIsIncorrect()
        {
            // Arrange
            var changePasswordDTO = new ChangePasswordDTO { Email = "user@example.com", OldPassword = "wrongpassword", NewPassword = "newpassword" };
            var user = new User { Email = changePasswordDTO.Email, Password = BCrypt.Net.BCrypt.HashPassword("oldpassword") };
            _mockUserRepository.Setup(repo => repo.GetUserByEmailAsync(changePasswordDTO.Email)).ReturnsAsync(user);

            // Act
            var result = await _userService.ChangePasswordAsync(changePasswordDTO);

            // Assert
            Assert.False(result);
        }
    }
}

