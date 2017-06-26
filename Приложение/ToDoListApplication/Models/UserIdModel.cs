using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ToDoListApplication.Models
{
    public class UserIdModel
    {
        public int Id { get; set; }
        public string FriendId { get; set; }
        public ICollection<TaskModel> TaskModel { get; set; }

        public UserIdModel()
        {
            TaskModel = new List<TaskModel>();
        }
    }
}