using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ToDoListApplication.Models
{
    /// <summary>
    /// Структура хранящая идентификатор пользователя
    /// </summary>
    public class UserId
    {
        /// <summary>
        /// Идентификатор записи
        /// </summary>
        public int Id { get; set; }
        /// <summary>
        /// Идентификатор пользователя
        /// </summary>
        public string Value { get; set; }
        public ICollection<TaskModel> TaskModel { get; set; }

        public UserId()
        {
            TaskModel = new List<TaskModel>();
        }
    }
}