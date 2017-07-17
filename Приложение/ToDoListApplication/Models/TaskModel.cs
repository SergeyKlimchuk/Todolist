using System;
using System.Collections.Generic;

namespace ToDoListApplication.Models
{
    /// <summary>
    /// Модель задания.
    /// </summary>
    public class TaskModel
    {
        /// <summary>
        /// Идентификатор.
        /// </summary>
        public int Id { get; set; }
        /// <summary>
        /// Заголовок.
        /// </summary>
        public string Title { get; set; }
        /// <summary>
        /// Текст.
        /// </summary>
        public string Text { get; set; }
        /// <summary>
        /// Статус выполнения.
        /// </summary>
        public bool Status { get; set; }
        /// <summary>
        /// Время оповещения.
        /// </summary>
        public DateTime AlarmTime { get; set; }
        /// <summary>
        /// Идентификатор автора задания.
        /// </summary>
        public virtual ApplicationUser Author { get; set; }
        /// <summary>
        /// Идентификаторы привязанных ярлыков.
        /// </summary>
        public virtual ICollection<LabelModel> Labels { get; set; }
        /// <summary>
        /// Идентификаторы привязанных пользователей.
        /// </summary>
        public virtual ICollection<ApplicationUser> Users { get; set; }
        
    }
}