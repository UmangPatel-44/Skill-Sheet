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
    public class SkillServiceTest
    {
        private readonly Mock<ISkillRepository> _mockSkillRepository;
        private readonly SkillService _skillService;

        public SkillServiceTest()
        {
            _mockSkillRepository = new Mock<ISkillRepository>();
            _skillService = new SkillService(_mockSkillRepository.Object);
        }

        [Fact]
        public async Task GetAllSkillsAsync_ReturnsAllSkills()
        {
            // Arrange
            var skills = new List<Skill>
            {
                new Skill { SkillId = 1, SkillName = "C#", Category = "Programming" },
                new Skill { SkillId = 2, SkillName = "SQL", Category = "Database" }
            };
            _mockSkillRepository.Setup(repo => repo.GetAllAsync()).ReturnsAsync(skills);

            // Act
            var result = await _skillService.GetAllSkillsAsync();

            // Assert
            Assert.Equal(2, result.Count());
            Assert.Equal("C#", result.First().SkillName);
        }

        [Fact]
        public async Task GetSkillByCategory_ReturnsSkillsByCategory()
        {
            // Arrange
            var skills = new List<Skill>
            {
                new Skill { SkillId = 1, SkillName = "C#", Category = "Programming" },
                new Skill { SkillId = 2, SkillName = "Java", Category = "Programming" }
            };
            _mockSkillRepository.Setup(repo => repo.GetSkillByCategory("Programming")).ReturnsAsync(skills);

            // Act
            var result = await _skillService.GetSkillByCategory("Programming");

            // Assert
            Assert.Equal(2, result.Count());
            Assert.Equal("C#", result.First().SkillName);
        }

        [Fact]
        public async Task GetCategory_ReturnsAllCategories()
        {
            // Arrange
            var categories = new List<string> { "Programming", "Database" };
            _mockSkillRepository.Setup(repo => repo.GetCategory()).ReturnsAsync(categories);

            // Act
            var result = await _skillService.GetCategory();

            // Assert
            Assert.Equal(2, result.Count());
            Assert.Contains("Programming", result);
        }
    }
}
