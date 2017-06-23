namespace ToDoListApplication.Models
{
    using System;
    using System.Data.Entity;
    using System.Linq;

    public class DataContext : DbContext
    {
        public DataContext()
            : base("name=DataContext")
        {
        }

        // Добавьте DbSet для каждого типа сущности, который требуется включить в модель. Дополнительные сведения 
        // о настройке и использовании модели Code First см. в статье http://go.microsoft.com/fwlink/?LinkId=390109.

        public virtual DbSet<TaskModel> TaskModels { get; set; }
        public virtual DbSet<LabelModel> LabelModels { get; set; }
        public virtual DbSet<UserFriend> FriendsModels { get; set; }
    }
    
}