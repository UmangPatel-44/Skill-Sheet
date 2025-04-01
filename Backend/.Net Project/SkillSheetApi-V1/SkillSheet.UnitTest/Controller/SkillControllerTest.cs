using Microsoft.AspNetCore.Mvc;
using Moq;
using SkillSheet.Services.Interfaces;
using SkillSheet.Models.DTOs;
using SkillSheet.WebApi.Controllers;

namespace SkillSheet.UnitTest.Controller
{
    public class SkillControllerTests
    {
        private readonly Mock<ISkillService> _mockSkillService;
        private readonly SkillController _skillController;

        public SkillControllerTests()
        {
            _mockSkillService = new Mock<ISkillService>();
            _skillController = new SkillController(_mockSkillService.Object);
        }

        [Fact]
        public async Task GetAllSkills_ReturnsOkResult_WithListOfSkills()
        {
            // Arrange
            var skills = new List<SkillDTO> { new SkillDTO { SkillId = 1, SkillName = "C#" } };
            _mockSkillService.Setup(service => service.GetAllSkillsAsync()).ReturnsAsync(skills);

            // Act
            var result = await _skillController.GetAllSkills();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnSkills = Assert.IsType<List<SkillDTO>>(okResult.Value);
            Assert.Single(returnSkills);
        }


        [Fact]
        public async Task GetSkillsByCategory_ReturnsOkResult_WithListOfSkills()
        {
            // Arrange
            var category = "Programming";
            var skills = new List<SkillDTO> { new SkillDTO { SkillId = 1, SkillName = "C#" } };
            _mockSkillService.Setup(service => service.GetSkillByCategory(category)).ReturnsAsync(skills);

            // Act
            var result = await _skillController.GetSkillsByCategory(category);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnSkills = Assert.IsType<List<SkillDTO>>(okResult.Value);
            Assert.Single(returnSkills);
        }

        [Fact]
        public async Task GetCategory_ReturnsOkResult_WithListOfCategories()
        {
            // Arrange
            var categories = new List<string> { "Programming", "Design" };
            _mockSkillService.Setup(service => service.GetCategory()).ReturnsAsync(categories);

            // Act
            var result = await _skillController.GetCategory();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnCategories = Assert.IsType<List<string>>(okResult.Value);
            Assert.Equal(2, returnCategories.Count);
        }
    }
}