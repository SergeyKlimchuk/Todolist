using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace ToDoListApplication.Models
{
    public class UserFriend
    {
        [Key, Column(Order = 1)]
        public string FirstUser { get; set; }
        [Key, Column(Order = 2)]
        public string SecondUser { get; set; }
    }
}