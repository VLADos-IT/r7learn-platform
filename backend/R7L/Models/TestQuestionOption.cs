using System;
using System.Collections;
using System.Collections.Generic;

namespace R7L.Models;

public partial class TestQuestionOption
{
    public int Id { get; set; }

    public int QuestionId { get; set; }

    public string Content { get; set; } = null!;

    public BitArray IsCorrect { get; set; } = null!;

    public virtual TestQuestion Question { get; set; } = null!;

    public virtual ICollection<TestQuestionUserAnswer> TestQuestionUserAnswers { get; set; } = new List<TestQuestionUserAnswer>();
}
