using System;
using System.Collections.Generic;
using Microsoft.AspNet.Identity;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ToDoListApplication.Models;
using System.Data.SqlClient;

namespace ToDoListApplication.Controllers
{
    public class HomeController : Controller
    {
        // Кол-во записей на странице
        const int PAGE_COUNT = 10;
        

        // Добавить пользователю друга
        private void AddFriend(string recipientId, string friendId)
        {
            try
            {
                DataContext context = new DataContext();

                if (recipientId == friendId) throw new Exception("Идентификаторы идентичны, системная ошибка!");

                bool contains = context.FriendsModels.Where(
                    f => (f.UserId == recipientId && f.FriendId == friendId) || (f.UserId == friendId && f.FriendId == recipientId)
                    ).Count() > 0;

                if (contains)
                {
                    return;
                }

                context.FriendsModels.Add(new UserFriend() { UserId = recipientId, FriendId = friendId });
                context.SaveChanges();
            }
            catch
            {

            }

        }

        // Получить список друзей текущего пользователя
        private List<UserRecord> GetFriends()
        {
            DataContext context = new DataContext();

            // Получаем идентификаторы друзей
            var friendsId = context.FriendsModels
                .Select(x => x).ToList()
                .Select(x=>x.IdentifyFriend(User.Identity.GetUserId())).ToArray();

            // Настраиваем запрос
            string connectionString = @"Data Source=(LocalDb)\MSSQLLocalDB;AttachDbFilename=|DataDirectory|\aspnet-ToDoListApplication-20170614114620.mdf;Initial Catalog=aspnet-ToDoListApplication-20170614114620;Integrated Security=True";
            SqlConnection connection = new SqlConnection(connectionString);
            string commandString = String.Format("SELECT * FROM AspNetUsers WHERE Id IN ('{0}')", String.Join("', '", friendsId));
            SqlCommand command = new SqlCommand(commandString, connection);
            connection.Open();
            SqlDataReader reader = command.ExecuteReader();
            
            List<UserRecord> usersRecords = new List<UserRecord>();
            
            while (reader.Read())
                usersRecords.Add(new UserRecord { Id = (string)reader[0], Email = (string)reader[1] });
            connection.Close();

            return usersRecords;
        }

        // Нужно добавлять ярлыки при помощи AJAX запросов.
        private void AddLabel(LabelModel label)
        {
            // Подключаемся к базе
            DataContext dataContext = new DataContext();

            dataContext.LabelModels.Add(label);
            dataContext.SaveChanges();
        }

        // Добавить задание
        private void AddTask(TaskModel task)
        {
            // Подключаемся к базе
            DataContext dataContext = new DataContext();

            dataContext.TaskModels.Add(task);
            dataContext.SaveChanges();
        }

        



        // Получить список всех пользователей
        private string GetUser(string id = null,  string email = null)
        {
            string connectionString = @"Data Source=(LocalDb)\MSSQLLocalDB;AttachDbFilename=|DataDirectory|\aspnet-ToDoListApplication-20170614114620.mdf;Initial Catalog=aspnet-ToDoListApplication-20170614114620;Integrated Security=True";
            SqlConnection connection = new SqlConnection(connectionString);


            bool multyChoose = false;
            string commandString = "SELECT * FROM AspNetUsers WHERE";
            
            try
            {
                connection.Open();
                // Проверка на пустые аргументы
                if (string.IsNullOrEmpty(id) && string.IsNullOrEmpty(email))
                {
                    return null;
                }

                if (id != null)
                {
                    multyChoose = true;
                    commandString += " Id=" + id;
                }

                if (email != null)
                {
                    if (multyChoose) commandString += " AND";
                    commandString += " Email='" + email + "'";
                }

                SqlCommand command = new SqlCommand(commandString, connection);
                SqlDataReader reader = command.ExecuteReader();
                string dd = reader.ToString();
                List<string> usersList = new List<string>();

                while (reader.Read())
                {
                    usersList.Add(reader[0].ToString());
                }
                return usersList.Count == 0 ? null : usersList[0];
            }
            catch
            {

            }
            finally
            {
                connection.Close();
            }


            return null;
        }
        



        public ActionResult EditLabel(int taskId, int labelId, string actionId)
        {
            // Подключаем контекст
            DataContext dataContext = new DataContext();
            // Ищем запись
            TaskModel task = dataContext.TaskModels.Include(t => t.LabelModel).Where(t => t.Id == taskId).ToList()[0];
            // Ищем ярлык
            LabelModel label = dataContext.LabelModels.Where(l => l.Id == labelId).ToList()[0];
            // Содержится ли ярлык в записи
            bool contain = task.LabelModel.Contains(label);
            
            if (Convert.ToBoolean(actionId))
            {
                if (!contain)
                {
                    task.LabelModel.Add(label);
                }
            }
            else
            {
                if (contain)
                {
                    task.LabelModel.Remove(label);
                }
            }
            dataContext.SaveChanges();

            //throw new Exception();

            // Возвращаем пустой ответ
            return new EmptyResult();
        }

        public ActionResult EditTaskText(int taskId, string text)
        {
            DataContext dataContext = new DataContext();
            var currentTask =  dataContext.TaskModels.Where(t => t.Id == taskId);

            if (currentTask == null) return null;

            currentTask.ToList()[0].Text = text;
            dataContext.SaveChanges();
            
            return new EmptyResult();
        }

        public ActionResult EditTitleText(int taskId, string title)
        {
            DataContext dataContext = new DataContext();
            var currentTask = dataContext.TaskModels.Where(t => t.Id == taskId);

            if (currentTask == null) return null;

            currentTask.ToList()[0].Title = title;
            dataContext.SaveChanges();

            return new EmptyResult();
        }
        
        public ActionResult Index()
        {


            return View();
        }

        [HttpGet]
        public ActionResult Tasks(int? page = null)
        {
            //AddToBase();
            // Контекст данных
            DataContext dataContext = new DataContext(); //AddToBase();
            // Определяем id пользователя
            var userId = User.Identity.GetUserId();

            var taskList = dataContext.TaskModels.Include(p => p.LabelModel).Where(t => t.AuthorId == userId);
            
            if (string.IsNullOrEmpty(userId)) Response.Redirect("/");

            List<LabelModel> labelsList = dataContext.LabelModels.Where(l => l.AuthorId == userId).ToList();
            
            // Подключение  контекста
            /* Тест кейс
             * (1) [0..9]
             * (2) [10..19]
             * (3) [20..29]
             */

            // Проверка на пустой аргумент
            if (page == null) page = 1;

            // Декриментируем для упрощения алгоритма
            page--;
            
            // Если страница меньше нуля выбивает ошибку.
            if (page < 0) return new HttpNotFoundResult("Page not found! (Out of range <)");

            // Вычисление промежуточных переменных
            int pageStart = Convert.ToInt32(page) * PAGE_COUNT;
            int pageStop = pageStart + PAGE_COUNT - 1;
            int recordsCount = taskList.Count();

            // Проверка на выход
            if (pageStart > recordsCount) return new HttpNotFoundResult("Page not found (Out of range >)!");

            // Задания на вывод
            List<TaskModel> tasks;

            // Если запрашиваемая страница будет отображена не полностью
            if (pageStop > recordsCount)
            {
                int countTasks = recordsCount - pageStart;

                tasks = taskList.ToList().GetRange(pageStart, countTasks);

            }
            else
            {
                tasks = taskList.ToList().GetRange(pageStart, PAGE_COUNT);
            }

            ViewBag.LabelsList = labelsList;

            return View(tasks);
        }




        /* --- TEST PLACE --- */

        // заполнить таблицу 
        private void AddToBase()
        {
            string userId = User.Identity.GetUserId();
            DataContext dataContext = new DataContext();
            LabelModel label1 = new LabelModel { Name = "Дом", Color = System.Drawing.Color.Azure, AuthorId = userId };
            LabelModel label2 = new LabelModel { Name = "Работа", Color = System.Drawing.Color.Purple, AuthorId = userId };
            List<LabelModel> labels = new List<LabelModel> { label1, label2 };
            dataContext.LabelModels.AddRange(labels);
            dataContext.SaveChanges();

            TaskModel task1 = new TaskModel { Title = "Хлебушек", Text = "Купить хлебушка, вспомнить что сам хлебушек", LabelModel = new List<LabelModel> { label1, label2 }, AuthorId = userId };
            task1.AlarmTime = DateTime.Now;
            TaskModel task2 = new TaskModel { Title = "Отчет", Text = "Сдать отчет г. директору предприятия 'ЦЕСНА'", LabelModel = new List<LabelModel> { label1 }, AuthorId = userId };
            task2.AlarmTime = DateTime.Now;
            dataContext.TaskModels.AddRange(new List<TaskModel> { task1, task2 });
            dataContext.SaveChanges();
        }

        
    }


    // Нужно вынести в отдельный класс
    public static class FriendModul
    {
        public static string IdentifyFriend(this UserFriend userFriendRecord, string currentUserId)
        {
            if (userFriendRecord != null && userFriendRecord.UserId != null && userFriendRecord.FriendId != null)
            {
                return userFriendRecord.UserId == currentUserId ? userFriendRecord.FriendId : userFriendRecord.UserId;
            }
            else
            {
                throw new ArgumentNullException("Запись пуста");
            }
            throw new ArgumentException("Внезапная ошибка!");
        }
    }

    public class UserRecord
    {
        public string Id { get; set; }
        public string Email { get; set; }

    }

}