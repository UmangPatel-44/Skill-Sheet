using Microsoft.EntityFrameworkCore;
using DataAccess.Entities.Context;
using DataAccess.Entities;
using DataAccess.Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DataAccess.Repositories.Implementation
{
    public class SkillRepository : ISkillRepository
    {
        private readonly SkillsheetContext _context;

        public SkillRepository(SkillsheetContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Function to return all Skills List
        /// </summary>
        /// <returns>List of Skills in Skill Table</returns>
        public async Task<IEnumerable<Skill>> GetAllAsync()
        {
            try
            {
                return await _context.Skills.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while fetching the skills.", ex);
            }
        }

        /// <summary>
        /// This function returns skill by categories
        /// </summary>
        /// <param name="Category"></param>
        /// <returns></returns>
        public async Task<IEnumerable<Skill>> GetSkillByCategory(string Category)
        {
            try
            {
                return await _context.Skills.Where(s => s.Category == Category).ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred while fetching skills for category: {Category}.", ex);
            }
        }

        /// <summary>
        /// This function returns all the categories in the table 
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<string>> GetCategory()
        {
            try
            {
                return await _context.Skills.Select(s => s.Category).Distinct().ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while fetching the skill categories.", ex);
            }
        }
    }
}
