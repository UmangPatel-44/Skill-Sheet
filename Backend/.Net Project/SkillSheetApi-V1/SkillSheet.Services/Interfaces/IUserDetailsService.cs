using DataAccess.Entities;
using Microsoft.AspNetCore.Http;
using SkillSheet.Models.DTOs;
using System.Threading.Tasks;

namespace SkillSheet.Services.Interfaces
{
    public interface IUserDetailService
    {
        Task <UserDetail> AddUserDetailsAsync(UserDetailDTO userDetailDTO);
        Task<UserDetailDTO> GetUserDetailByUserIdAsync(int userId);
        Task<bool> UpdateUserDetailAsync(int userId, UserDetailDTO   userDetailDto);
        public Task<string?> UpdateProfilePhotoAsync(int userId, IFormFile photoFile);

    }
}
