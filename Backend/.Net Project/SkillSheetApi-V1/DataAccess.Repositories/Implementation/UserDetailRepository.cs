using Microsoft.EntityFrameworkCore;
using DataAccess.Entities.Context;
using DataAccess.Entities;
using DataAccess.Repositories.Interfaces;
using System;
using System.Threading.Tasks;

namespace DataAccess.Repositories.Implementation
{
    public class UserDetailRepository : IUserDetailRepository
    {
        private readonly SkillsheetContext _context;

        public UserDetailRepository(SkillsheetContext context)
        {
            _context = context;
        }

        #region User Details Operation (Create, Read, Update)

        /// <summary>
        /// Retrieves user details based on UserId
        /// </summary>
        /// <param name="UserId"></param>
        /// <returns></returns>
        public async Task<UserDetail> GetUserDetailByUserIdAsync(int UserId)
        {
            try
            {
                return await _context.Userdetails.FirstOrDefaultAsync(u => u.UserId == UserId);
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred while fetching user details for UserId: {UserId}.", ex);
            }
        }

        /// <summary>
        /// Updates user details
        /// </summary>
        /// <param name="userDetail"></param>
        /// <returns></returns>
        public async Task<bool> UpdateUserDetailAsync(UserDetail userDetail)
        {
            try
            {
                _context.Userdetails.Update(userDetail);
                return await _context.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred while updating user details for UserId: {userDetail.UserId}.", ex);
            }
        }

        /// <summary>
        /// Creates a new user detail record
        /// </summary>
        /// <param name="userDetail"></param>
        /// <returns></returns>
        public async Task<UserDetail> CreateUserDetailAsync(UserDetail userDetail)
        {
            try
            {
                await _context.Userdetails.AddAsync(userDetail);
                await _context.SaveChangesAsync();
                return userDetail;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while creating user details.", ex);
            }
        }

        #endregion

        /// <summary>
        /// Updates the profile photo path for a given user
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="photoPath"></param>
        /// <returns></returns>
        public async Task<bool> UpdateProfilePhotoAsync(int userId, string photoPath)
        {
            try
            {
                var userDetail = await _context.Userdetails.FirstOrDefaultAsync(u => u.UserId == userId);

                if (userDetail == null)
                {
                    return false; // User not found
                }

                userDetail.PhotoPath = photoPath; // Update photo path
                return await _context.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred while updating profile photo for UserId: {userId}.", ex);
            }
        }
    }
}
