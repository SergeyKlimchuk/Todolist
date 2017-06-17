using System;
using System.Collections.Generic;

namespace ToDoListApplication.Models
{
    public class TaskRecord
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Text { get; set; }
        public IEnumerable<Label> Labels { get; set; }
        public DateTime AlarmTime { get; set; }
        public int AuthorID { get; set; }
        public IEnumerable<int> AdditionalUsersId { get; set; }

        public TaskRecord()
        {
            this.Labels = new List<Label>();
        }

        public TaskRecord(string title, string text)
        {
            Labels = new List<Label>();
            this.Title = title;
            this.Text = text;
        }
    }
}