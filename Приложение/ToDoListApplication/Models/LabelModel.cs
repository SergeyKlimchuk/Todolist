using System.Collections.Generic;
namespace ToDoListApplication.Models
{
    using System.Drawing;

    /// <summary>
    /// Модель ярлыка.
    /// </summary>
    public class LabelModel
    {
        /// <summary>
        /// Идентификатор записи.
        /// </summary>
        public int Id { get; set; }
        /// <summary>
        /// Тект ярлыка.
        /// </summary>
        public string Text { get; set; }
        /// <summary>
        /// Цвет ярлыка.
        /// </summary>
        public string Color { get; set; }
        /// <summary>
        /// Автор ярлыка.
        /// </summary>
        public ApplicationUser Author { get; set; }
        /// <summary>
        /// Системное, свзязь ярлык -> пользователи.
        /// </summary>
        public virtual ICollection<TaskModel> Tasks { get; set; }
        
    }
}