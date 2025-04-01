using Moq;
using SkillSheet.Services.Interfaces;
using SkillSheet.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using SkillSheet.WebApi.Controllers;

namespace SkillSheet.UnitTest.Controller
{
    public class UserSkillControllerTests
    {
        private readonly Mock<IUserSkillService> _mockUserSkillService;
        private readonly UserSkillController _userSkillController;

        public UserSkillControllerTests()
        {
            _mockUserSkillService = new Mock<IUserSkillService>();
            _userSkillController = new UserSkillController(_mockUserSkillService.Object);

            // Mocking the HttpContext for User Claims
            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, "1")
            }, "mock"));

            _userSkillController.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };
        }

        [Fact]
        public async Task GetUserSkills_ReturnsOk_WhenUserIdIsValid()
        {
            // Arrange
            var userId = 1;
            var userSkills = new List<UserSkillDTO> { new UserSkillDTO { UserId = userId, SkillId = 1, Experience=10} };
            _mockUserSkillService.Setup(service => service.GetUserSkillsAsync(userId)).ReturnsAsync(userSkills);

            // Act
            var result = await _userSkillController.GetUserSkills(userId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(userSkills, okResult.Value);
        }

        [Fact]
        public async Task GetUserSkills_ReturnsBadRequest_WhenUserIdIsInvalid()
        {
            // Arrange
            var userId = 2;

            // Act
            var result = await _userSkillController.GetUserSkills(userId);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Please Enter the Login Id only", badRequestResult.Value);
        }

        [Fact]
        public async Task AddUserSkill_ReturnsCreatedAtAction_WhenUserSkillIsAdded()
        {
            // Arrange
            var userSkillDTO = new UserSkillDTO { UserId = 1, SkillId = 1, Experience=9 };
            _mockUserSkillService.Setup(service => service.AddUserSkillAsync(userSkillDTO)).Returns(Task.CompletedTask);

            // Act
            var result = await _userSkillController.AddUserSkill(userSkillDTO);

            // Assert
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result);
            Assert.Equal(nameof(_userSkillController.GetUserSkills), createdAtActionResult.ActionName);
            Assert.Equal(userSkillDTO.UserId, createdAtActionResult.RouteValues["userId"]);
            Assert.Equal(userSkillDTO, createdAtActionResult.Value);
        }

        [Fact]
        public async Task DeleteUserSkill_ReturnsNoContent_WhenUserSkillIsDeleted()
        {
            // Arrange
            var skillId = 1;
            _mockUserSkillService.Setup(service => service.DeleteUserSkillAsync(skillId)).ReturnsAsync(true);

            // Act
            var result = await _userSkillController.DeleteUserSkill(skillId);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task DeleteUserSkill_ReturnsNotFound_WhenUserSkillIsNotFound()
        {
            // Arrange
            var skillId = 1;
            _mockUserSkillService.Setup(service => service.DeleteUserSkillAsync(skillId)).ReturnsAsync(false);

            // Act
            var result = await _userSkillController.DeleteUserSkill(skillId);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }
    }
}
