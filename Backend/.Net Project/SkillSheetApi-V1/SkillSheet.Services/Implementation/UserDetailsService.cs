using SkillSheet.Models.DTOs;
using DataAccess.Entities;
using DataAccess.Repositories.Interfaces;
using SkillSheet.Services.Interfaces;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Http;
using System.Linq.Expressions;

namespace SkillSheet.Services.Implementation
{
    public class UserDetailService : IUserDetailService
    {
        private readonly IUserDetailRepository _userDetailRepository;
        private readonly string _photoUploadPath = "wwwroot/uploads/profile_photos";
        public UserDetailService(IUserDetailRepository userDetailRepository)
        {
            _userDetailRepository = userDetailRepository;
        }

        public async Task<UserDetail> AddUserDetailsAsync(UserDetailDTO userDetailDTO)
        {
            try
            {
                var newUserDetails = new UserDetail
                {
                    UserId = userDetailDTO.UserId,
                    Gender = userDetailDTO.Gender,
                    BirthDate = userDetailDTO.BirthDate,
                    JoiningDate = userDetailDTO.JoiningDate,
                    Qualifications = userDetailDTO.Qualifications,
                    WorkedInJapan = userDetailDTO.WorkedInJapan,
                    PhotoPath = userDetailDTO.PhotoPath
                };

                return await _userDetailRepository.CreateUserDetailAsync(newUserDetails);
            }
            catch (Exception ex) { throw new Exception(ex.Message); }
        }

        public async Task<UserDetailDTO> GetUserDetailByUserIdAsync(int userId)
        {
            try
            {
                var userDetail = await _userDetailRepository.GetUserDetailByUserIdAsync(userId);
                if (userDetail == null) return null;

                return new UserDetailDTO
                {
                    UserId = userDetail.UserId,
                    Gender = userDetail.Gender,
                    BirthDate = userDetail.BirthDate,
                    JoiningDate = userDetail.JoiningDate,
                    Qualifications = userDetail.Qualifications,
                    WorkedInJapan = (bool)userDetail.WorkedInJapan,
                    PhotoPath = userDetail.PhotoPath
                };
            }
            catch (Exception ex) { throw new Exception(ex.Message); }
            
        }

        public async Task<bool> UpdateUserDetailAsync(int userId, UserDetailDTO userDetailDto)
        {
            try{var existingDetail = await _userDetailRepository.GetUserDetailByUserIdAsync(userId);
            if (existingDetail == null) return false;

            existingDetail.Gender = userDetailDto.Gender;
            existingDetail.BirthDate = userDetailDto.BirthDate;
            existingDetail.JoiningDate = userDetailDto.JoiningDate;
            existingDetail.Qualifications = userDetailDto.Qualifications;
            existingDetail.WorkedInJapan = userDetailDto.WorkedInJapan;
            existingDetail.PhotoPath = userDetailDto.PhotoPath;

                return await _userDetailRepository.UpdateUserDetailAsync(existingDetail);
            }
            catch(Exception ex){ throw new Exception(ex.Message); }
        }
        public async Task<string?> UpdateProfilePhotoAsync(int userId, IFormFile photoFile)
        {
            try
            {
                var userDetail = await _userDetailRepository.GetUserDetailByUserIdAsync(userId);
                if (userDetail == null) return null;

                if (photoFile != null && photoFile.Length > 0)
                {
                    var fileExtension = Path.GetExtension(photoFile.FileName);
                    var fileName = $"user_{userId}{fileExtension}"; // Keeps filename same to prevent duplicate images
                    var filePath = Path.Combine(_photoUploadPath, fileName);

                    // **Delete Old Photo if it Exists**
                    if (!string.IsNullOrEmpty(userDetail.PhotoPath))
                    {
                        var oldFilePath = Path.Combine(_photoUploadPath, Path.GetFileName(userDetail.PhotoPath));
                        if (File.Exists(oldFilePath))
                        {
                            File.Delete(oldFilePath);
                        }
                    }

                    // **Ensure Directory Exists**
                    if (!Directory.Exists(_photoUploadPath))
                    {
                        Directory.CreateDirectory(_photoUploadPath);
                    }

                    // Save New Photo
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await photoFile.CopyToAsync(stream);
                    }

                    // Update Database with New Path
                    userDetail.PhotoPath = $"/uploads/profile_photos/{fileName}";
                    var isUpdated = await _userDetailRepository.UpdateUserDetailAsync(userDetail);

                    return isUpdated ? userDetail.PhotoPath : null; // Return new path if update is successful, otherwise null
                }

                return null;
            }
            catch (Exception ex) { throw new Exception(ex.Message); }
        }

    }
}
