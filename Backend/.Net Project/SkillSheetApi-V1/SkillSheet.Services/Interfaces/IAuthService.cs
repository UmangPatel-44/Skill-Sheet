using SkillSheet.Models.DTOs;
using System.Threading.Tasks;

namespace SkillSheet.Services.Interfaces
{
    public interface IAuthService
    {
        Task<string> AuthenticateAsync(LoginDto loginDto);
    }
}
