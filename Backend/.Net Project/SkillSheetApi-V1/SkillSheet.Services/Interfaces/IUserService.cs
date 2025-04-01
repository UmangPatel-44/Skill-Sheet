using DataAccess.Entities;
using SkillSheet.Models.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SkillSheet.Services.Interfaces
{
    public interface IUserService
    {
        
        Task<User> GetUserByIdAsync(int id);
        Task<User> GetUserByEmailAsync(string email);
        Task<bool> DeleteUserAsync(string email);
        
        Task<IEnumerable<User>> GetUsersByRole(string Role);
        Task<bool> ChangeUserAsync(ChangeUserDTO user);

        Task<IEnumerable<AdminViewDTO>> GetUserListAsync();
        Task<User> AddUserAsync(CreateUserDTO userDTO);
        Task <bool> ChangeAdminViewAsync(ChangeAdminViewDTO adminViewDTO);
        Task<bool> ChangePasswordAsync(ChangePasswordDTO changePasswordDTO);
    }
}
