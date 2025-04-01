using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace DataAccess.Entities;

public partial class Skill
{
    public int SkillId { get; set; }
    [Column("skillName")]
    public string SkillName { get; set; } = null!;
    [Column("category")]
    public string Category { get; set; } = null!;

    public virtual ICollection<UserSkill> Userskills { get; set; } = new List<UserSkill>();
}
