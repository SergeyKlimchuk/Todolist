using System.Collections.Generic;
namespace ToDoListApplication.Models
{
    using System.Drawing;

    public class LabelModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public Color Color { get; set; }
        public string AuthorId { get; set; }

        public ICollection<TaskModel> TaskModel { get; set; }

        public LabelModel()
        {
            TaskModel = new List<TaskModel>();
        }
    }
}