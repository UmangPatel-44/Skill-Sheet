using Xunit;
using Moq;
using SkillSheet.Services.Implementation;
using SkillSheet.Services.Interfaces;
using SkillSheet.Models.DTOs;
using DataAccess.Entities;
using DataAccess.Repositories.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SkillSheet.UnitTest.Service
{
    public class UserSkillServiceTest
    {
        private readonly Mock<IUserSkillRepository> _mockUserSkillRepository;
        private readonly UserSkillService _userSkillService;

        public UserSkillServiceTest()
        {
            _mockUserSkillRepository = new Mock<IUserSkillRepository>();
            _userSkillService = new UserSkillService(_mockUserSkillRepository.Object);
        }

        [Fact]
        public async Task GetUserSkillsAsync_ReturnsUserSkills()
        {
            // Arrange
            var userId = 1;
            var userSkills = new List<UserSkill>
            {
                new UserSkill { UserSkillId = 1, UserId = userId, SkillId = 1, Experience = 5, DateAdded = DateOnly.FromDateTime(DateTime.Now) },
                new UserSkill { UserSkillId = 2, UserId = userId, SkillId = 2, Experience = 3, DateAdded = DateOnly.FromDateTime(DateTime.Now) }
            };
            _mockUserSkillRepository.Setup(repo => repo.GetByUserIdAsync(userId)).ReturnsAsync(userSkills);

            // Act
            var result = await _userSkillService.GetUserSkillsAsync(userId);

            // Assert
            Assert.Equal(2, result.Count());
            Assert.Equal(1, result.First().SkillId);
        }

        [Fact]
        public async Task AddUserSkillAsync_AddsUserSkill()
        {
            // Arrange
            var userSkillDto = new UserSkillDTO { UserId = 1, SkillId = 1, Experience = 5, DateAdded = DateOnly.FromDateTime(DateTime.Now) };
            _mockUserSkillRepository.Setup(repo => repo.AddAsync(It.IsAny<UserSkill>())).Returns(Task.CompletedTask);

            // Act
            await _userSkillService.AddUserSkillAsync(userSkillDto);

            // Assert
            _mockUserSkillRepository.Verify(repo => repo.AddAsync(It.Is<UserSkill>(us => us.UserId == 1 && us.SkillId == 1 && us.Experience == 5)), Times.Once);
        }

        [Fact]
        public async Task DeleteUserSkillAsync_DeletesUserSkill()
        {
            // Arrange
            var userSkillId = 1;
            _mockUserSkillRepository.Setup(repo => repo.DeleteAsync(userSkillId)).ReturnsAsync(true);

            // Act
            var result = await _userSkillService.DeleteUserSkillAsync(userSkillId);

            // Assert
            Assert.True(result);
            _mockUserSkillRepository.Verify(repo => repo.DeleteAsync(userSkillId), Times.Once);
        }
    }
}
