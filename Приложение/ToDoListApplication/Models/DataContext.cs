namespace ToDoListApplication.Models
{
    using System;
    using System.Collections.Generic;
    using Microsoft.AspNet.Identity;
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

        public virtual DbSet<TaskModel> Tasks { get; set; }
        public virtual DbSet<LabelModel> Labels { get; set; }
        public virtual DbSet<UserFriend> Friends { get; set; }
        public virtual DbSet<UserId> UsersIds { get; set; }

        /// <summary>
        /// Возвращает лист друзей по идентификатору.
        /// </summary>
        /// <param name="id">Идентификатор пользователя</param>
        /// <returns>Возвращает лист пользователей</returns>
        public List<ApplicationUser> GetUserFriendsByUserId(string id)
        {
            // Получаем записи с нашим идентификатором
            List<UserFriend> userFriends = this.Friends.Where(f => f.FirstUser == id || f.SecondUser == id).ToList();

            // Получаем лист идентификаторов
            List<string> friendsIds = userFriends.Select(r => r.IdentifyFriend(id)).ToList();

            // Получаем контекст с пользователями
            ApplicationDbContext usersContext = new ApplicationDbContext();

            return usersContext.Users.Where(u => friendsIds.Contains(u.Id)).ToList();
        }

        /// <summary>
        /// Возвращает лист заданий по идентификатору
        /// </summary>
        /// <param name="id">Уникальный идентификатор</param>
        /// <returns>Список заданий</returns>
        public List<TaskModel> GetUserTasksByUserId(string id)
        {
            return this.Tasks
                .Include(p => p.LabelModel).Include(p => p.UsersIds)
                .Where(t => t.AuthorId == id)
                .OrderByDescending(t => t.Id)
                .ToList();
        }

        /// <summary>
        /// Возвращает лист ярлыков связанные с идентификатором пользователя
        /// </summary>
        /// <param name="id">Идентификатор пользователя</param>
        /// <returns>Список ярлыков</returns>
        public List<LabelModel> GetLabelsListByUserId(string id)
        {
            return this.Labels
                .Where(l => l.AuthorId == id)
                .ToList();
        }
        
    }

    // Нужно вынести в отдельный файл
    public static class Extend
    {
        /// <summary>
        /// Определяет и возвращает идентификатор друга из записи.
        /// </summary>
        /// <param name="userFriendRecord">Запись "UserFriend"</param>
        /// <param name="currentUserId">Идентификатор пользователя</param>
        /// <returns></returns>
        public static string IdentifyFriend(this UserFriend userFriendRecord, string currentUserId)
        {
            if (userFriendRecord != null && userFriendRecord.FirstUser != null && userFriendRecord.SecondUser != null)
            {
                return userFriendRecord.FirstUser == currentUserId ? userFriendRecord.SecondUser : userFriendRecord.FirstUser;
            }
            else
            {
                throw new ArgumentNullException("Any args is empty!");
            }
            throw new ArgumentException("Logic error!");
        }
    }

}