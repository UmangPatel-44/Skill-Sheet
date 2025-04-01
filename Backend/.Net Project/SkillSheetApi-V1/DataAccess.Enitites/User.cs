using System;
using System.Collections.Generic;

namespace DataAccess.Entities;

public class User
{
    public int UserId { get; set; }

    public string Name { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Password { get; set; } = null!;

    public string Role { get; set; } = null!;

    public bool? IsActive { get; set; }

    public DateTime? CreatedDate { get; set; }

    public virtual UserDetail UserDetail { get; set; }

    public virtual ICollection<UserSkill> Userskills { get; set; } = new List<UserSkill>();
}
