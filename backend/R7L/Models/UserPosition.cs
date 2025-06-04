using System;
using System.Collections.Generic;

namespace R7L.Models;

public partial class UserPosition
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
