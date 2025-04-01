using Microsoft.EntityFrameworkCore;
using DataAccess.Entities.Context;
using DataAccess.Entities;
using DataAccess.Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccess.Repositories.Implementation
{
    public class UserSkillRepository : IUserSkillRepository
    {
        private readonly SkillsheetContext _context;

        public UserSkillRepository(SkillsheetContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retrieves user skills based on UserId.
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public async Task<IEnumerable<UserSkill>> GetByUserIdAsync(int userId)
        {
            try
            {
                return await _context.Userskills
                    .Where(us => us.UserId == userId)
                    .Join(_context.Skills,
                        us => us.SkillId,
                        s => s.SkillId,
                        (us, s) => new UserSkill
                        {
                            UserSkillId = us.UserSkillId,
                            UserId = us.UserId,
                            SkillId = us.SkillId,
                            Skill = new Skill
                            {
                                SkillId = s.SkillId,
                                SkillName = s.SkillName ?? "Not Found",
                                Category = s.Category ?? "Not Found"
                            },
                            Experience = us.Experience,
                            DateAdded = us.DateAdded
                        })
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred while fetching user skills for UserId: {userId}.", ex);
            }
        }

        /// <summary>
        /// Adds a new user skill to the database.
        /// </summary>
        /// <param name="userSkill"></param>
        public async Task AddAsync(UserSkill userSkill)
        {
            try
            {
                await _context.Userskills.AddAsync(userSkill);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while adding a user skill.", ex);
            }
        }

        /// <summary>
        /// Deletes a user skill by its ID.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                var userSkill = await _context.Userskills.FindAsync(id);
                if (userSkill == null) return false;

                _context.Userskills.Remove(userSkill);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred while deleting the user skill with ID: {id}.", ex);
            }
        }
    }
}
