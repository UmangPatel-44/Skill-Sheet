using DataAccess.Entities;
using System.Threading.Tasks;

namespace DataAccess.Repositories.Interfaces
{
    public interface IUserDetailRepository
    {
        Task<UserDetail> GetUserDetailByUserIdAsync(int UserId);
        Task<bool> UpdateUserDetailAsync(UserDetail userDetail);
        Task<UserDetail> CreateUserDetailAsync(UserDetail userDetail);
        public Task<bool> UpdateProfilePhotoAsync(int userId, string photoPath);

    }
}
