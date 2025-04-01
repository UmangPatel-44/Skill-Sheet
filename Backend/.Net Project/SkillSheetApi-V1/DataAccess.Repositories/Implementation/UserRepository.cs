using Microsoft.EntityFrameworkCore;
using DataAccess.Entities;
using DataAccess.Entities.Context;
using DataAccess.Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DataAccess.Repositories.Implementation
{
    public class UserRepository : IUserRepository
    {
        private readonly SkillsheetContext _context;

        public UserRepository(SkillsheetContext context)
        {
            _context = context;
        }

        #region User Operations (Get using Id, Email; Update; Delete)

        /// <summary>
        /// Retrieves a user by their ID.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<User> GetUserByIdAsync(int id)
        {
            try
            {
                return await _context.Users.FindAsync(id);
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred while fetching the user with ID: {id}.", ex);
            }
        }

        /// <summary>
        /// Retrieves a user by their email.
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>
        public async Task<User> GetUserByEmailAsync(string email)
        {
            try
            {
                return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred while fetching the user with email: {email}.", ex);
            }
        }

        /// <summary>
        /// Deletes a user by email.
        /// </summary>
        /// <param name="email"></param>
        public async Task DeleteUserAsync(string email)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

                if (user != null)
                {
                    _context.Users.Remove(user);
                    await _context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred while deleting the user with email: {email}.", ex);
            }
        }

        #endregion

        /// <summary>
        /// Retrieves users based on role.
        /// </summary>
        /// <param name="role"></param>
        /// <returns></returns>
        public async Task<IEnumerable<User>> GetUserByRoleAsync(string role)
        {
            try
            {
                return await _context.Users.Where(u => u.Role == role).ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred while fetching users with role: {role}.", ex);
            }
        }

        /// <summary>
        /// Updates user information.
        /// </summary>
        /// <param name="user"></param>
        public async Task ChangeUserAsync(User user)
        {
            try
            {
                if (user != null)
                {
                    _context.Users.Update(user);
                    await _context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred while updating user details for UserId: {user?.UserId}.", ex);
            }
        }

        /// <summary>
        /// Retrieves a list of users with the role "User".
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<User>> GetUserListAsync()
        {
            try
            {
                return await _context.Users.Where(u => u.Role == "User").ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while fetching the user list.", ex);
            }
        }

        /// <summary>
        /// Adds a new user to the database.
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public async Task<User> AddUserAsync(User user)
        {
            try
            {
                await _context.Users.AddAsync(user);
                await _context.SaveChangesAsync();
                return user;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while adding a new user.", ex);
            }
        }
    }
}
