using System;
using System.Collections.Generic;

namespace ToDoListApplication.Models
{
    public class TaskModel
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Text { get; set; }
        public DateTime AlarmTime { get; set; }
        public string AuthorId { get; set; }
        
        public ICollection<LabelModel> LabelModel { get; set; }

        public TaskModel()
        {
            LabelModel = new List<LabelModel>();
        }
        
    }
}