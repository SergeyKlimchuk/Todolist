namespace ToDoListApplication.Models
{
    using System;
    using System.Data.Entity;
    using System.Linq;
    using ToDoListApplication.Models;

    public class TaskViewModels : DbContext
    {
        public TaskViewModels()
            : base("name=TaskViewModels")
        {
        }

        public virtual DbSet<Label> Labels { get; set; }
        public virtual DbSet<TaskRecord> TaskRecords { get; set; }
    }
}