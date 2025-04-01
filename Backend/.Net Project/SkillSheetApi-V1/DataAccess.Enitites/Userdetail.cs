using System;
using System.Collections.Generic;
using DataAccess.Entities;
namespace DataAccess.Entities;

public partial class UserDetail
{
    public int UserId { get; set; }

    public string? Gender { get; set; }
    
    public DateOnly BirthDate { get; set; }

    public DateOnly JoiningDate { get; set; }

    public string? Qualifications { get; set; }

    public bool? WorkedInJapan { get; set; }

    public string? PhotoPath { get; set; }

    public virtual User User { get; set; } = null!;
}
