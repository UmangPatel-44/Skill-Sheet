using System;
using System.Collections.Generic;

namespace DataAccess.Entities;

public partial class UserSkill
{
    public int UserSkillId { get; set; }

    public int UserId { get; set; }

    public int SkillId { get; set; }

    public double? Experience { get; set; }

    public DateOnly? DateAdded { get; set; }

    public virtual Skill Skill { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
