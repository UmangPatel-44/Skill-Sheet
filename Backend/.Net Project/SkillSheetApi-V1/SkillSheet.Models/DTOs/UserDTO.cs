using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SkillSheet.Models.DTOs
{
    public class UserDTO
    {
        public int UserId { get; set; }

        public string Name { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string Password { get; set; } = null!;

        public string Role { get; set; } = null!;

        public bool? IsActive { get; set; }

        public DateTime? CreatedDate { get; set; }

        public virtual UserDetailDTO UserDetail { get; set; }
    }
}
