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
        public string FirstUser { get; set; }
        public string SecondUser { get; set; }
    }
}