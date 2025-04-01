using DataAccess.Entities;
using SkillSheet.Models.DTOs;
using DataAccess.Repositories.Interfaces;
using SkillSheet.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace SkillSheet.Services.Implementation
{
    public class UserService :IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration; // Add this line

        public UserService(IUserRepository userRepository, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _configuration = configuration; // Assign it
        }


        public async Task<User> GetUserByIdAsync(int id)
        {
            try{ return await _userRepository.GetUserByIdAsync(id); }
            catch(Exception ex) { throw new Exception(ex.Message); }
        }

        public async Task<User> GetUserByEmailAsync(string email)
        {
            try { return await _userRepository.GetUserByEmailAsync(email); }
            catch (Exception ex) { throw new Exception(ex.Message); }
        }

        public async Task<bool> DeleteUserAsync(string email)
        {
            try
            {
                var user = await _userRepository.GetUserByEmailAsync(email);
                if (user == null)
                {
                    return false; // User not found
                }
                var emailService = new EmailService(_configuration);
                emailService.UserDeletedByAdminAsync(email);

                await _userRepository.DeleteUserAsync(email);

                return true;
            }
            catch (Exception ex) { throw new Exception(ex.Message); }
        }


        

        public async Task<IEnumerable<User>> GetUsersByRole(string Role)
        {
            try { return await _userRepository.GetUserByRoleAsync(Role); }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> ChangeUserAsync(ChangeUserDTO user)
        {
            try
            {
                var existingUser = await _userRepository.GetUserByIdAsync(user.UserId);
                if (existingUser == null)
                {
                    return false; // User not found
                }
                existingUser.Name = user.Name;
                existingUser.IsActive = user.IsActive;
                await _userRepository.ChangeUserAsync(existingUser);
                return true;
            }
            catch (Exception ex) { throw new Exception(ex.Message); }
        }
        public async Task<IEnumerable<AdminViewDTO>> GetUserListAsync()
        {
            try{var user = await _userRepository.GetUserListAsync();
            var userList = user.Select(u => new AdminViewDTO
            {
                UserId = u.UserId,
                Name = u.Name,
                Email = u.Email,
                Password=u.Password
            });
                return userList;
            }catch (Exception ex) { throw new Exception(ex.Message);}
        }
        public async Task<User> AddUserAsync(CreateUserDTO userDTO)
        {
            try{
                var newUser = new User
            {
                Name = userDTO.Name,
                Email = userDTO.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(userDTO.Password), // Secure password storage
                Role = userDTO.Role, // Default role
                IsActive = true, // Set active status
                CreatedDate = DateTime.Today // Set created date
            };
                var response = await _userRepository.AddUserAsync(newUser);
                var emailService = new EmailService(_configuration);
                emailService.NewUserEmailAsync(userDTO.Email, userDTO.Name, userDTO.Password);
                return response;

            }
            catch(Exception ex ) { throw new Exception(ex.Message); }
        }

        public async Task<bool> ChangeAdminViewAsync(ChangeAdminViewDTO adminViewDTO)
        {
            try
            {
                var existingUser = await _userRepository.GetUserByEmailAsync(adminViewDTO.Email);
                if (existingUser == null)
                {
                    return false; // User not found
                }
                existingUser.Name = adminViewDTO.Name;
                existingUser.Email = adminViewDTO.Email;
                var isPasswordSame = adminViewDTO.Password == existingUser.Password;
                if (!isPasswordSame)
                {
                    var hashPassword = BCrypt.Net.BCrypt.HashPassword(adminViewDTO.Password);
                    existingUser.Password = hashPassword;
                }

                await _userRepository.ChangeUserAsync(existingUser);
                var emailService = new EmailService(_configuration);
                emailService.SendAdminChangeNotificationAsync(adminViewDTO.Email,adminViewDTO.Name, adminViewDTO.Password, isPasswordSame);
                return true;
            }
            catch (Exception ex) { throw new Exception(ex.Message); }
            }
         public async Task<bool> ChangePasswordAsync(ChangePasswordDTO changePasswordDTO)
         {
            try
            {
                var existingUser = await _userRepository.GetUserByEmailAsync(changePasswordDTO.Email);
                if (existingUser == null)
                {
                    return false; // User not found
                }

                if (!BCrypt.Net.BCrypt.Verify(changePasswordDTO.OldPassword, existingUser.Password))
                {
                    return false; // Enter Correct old password
                }
                existingUser.Password = BCrypt.Net.BCrypt.HashPassword(changePasswordDTO.NewPassword);
                await _userRepository.ChangeUserAsync(existingUser);
                var emailService = new EmailService(_configuration);
                emailService.SendPasswordChangeEmailAsync(changePasswordDTO.Email, changePasswordDTO.NewPassword);
                return true;
            }
            catch (Exception ex) { throw new Exception(ex.Message); }
         }
    }
}
