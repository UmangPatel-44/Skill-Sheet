using DataAccess.Entities;

namespace DataAccess.Repositories.Interfaces
{
    public interface IUserRepository
    {
      
        Task<User> GetUserByIdAsync(int id);
        Task<User> GetUserByEmailAsync(string email);
        Task DeleteUserAsync(string email);
        Task ChangeUserAsync(User user);
        Task<IEnumerable<User>> GetUserByRoleAsync(string Role);
        Task<IEnumerable<User>> GetUserListAsync();
        Task<User> AddUserAsync(User user);


    }
}
