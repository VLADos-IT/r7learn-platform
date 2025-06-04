using System;
using System.Collections.Generic;

namespace R7L.Models;

public partial class TestQuestionUserAnswer
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int TestQuestionId { get; set; }

    public int AnswerId { get; set; }

    public virtual TestQuestionOption Answer { get; set; } = null!;

    public virtual TestQuestion TestQuestion { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
