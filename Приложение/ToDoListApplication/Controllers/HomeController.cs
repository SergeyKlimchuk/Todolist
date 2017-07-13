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

        // Контекст данных
        ApplicationDbContext dataContext = new ApplicationDbContext();

        #region AJAX - запросы
        
        /// <summary>
        /// Устанавливает принятый заголовок к заданию по идентификатору.
        /// </summary>
        /// <param name="taskId">Идентификатор задания.</param>
        /// <param name="text">Текст заголовка.</param>
        /// <returns>Возвращает пустой ответ.</returns>
        [HttpPost]
        public ActionResult AjaxSetTaskTitle(int taskId, string text)
        {
            dataContext.Tasks
                .Single(t => t.Id == taskId)
                .Title = text;
            
            dataContext.SaveChanges();
            return new EmptyResult();
        }
        /// <summary>
        /// Устанавливает принятый текст к заданию по идентификатору.
        /// </summary>
        /// <param name="taskId">Идентификатор задания.</param>
        /// <param name="text">Текст задания.</param>
        /// <returns>Возвращает пустой ответ.</returns>
        [HttpPost]
        public ActionResult AjaxSetTaskText(int taskId, string text)
        {
            dataContext.Tasks
                .Single(t => t.Id == taskId)
                .Text = text;

            dataContext.SaveChanges();
            return new EmptyResult();
        }
        /// <summary>
        /// Добавляет или Удаляет пользователя из задания.
        /// </summary>
        /// <param name="taskId">Идентификатор задания.</param>
        /// <param name="userId">Идентификатор пользователя</param>
        /// <param name="isAddAction">
        /// Переменная отвечает за действие которое будет выполнятся. При "True" будет добавление пользователя, иначе удаление из задания.
        /// </param>
        /// <returns>Возвращает пустой ответ.</returns>
        [HttpPost]
        public ActionResult AjaxSetTaskUser(int taskId, string userId, bool isAddAction)
        {
            TaskModel currentTask = dataContext.Tasks
                .Single(t => t.Id == taskId);

            ApplicationUser user = dataContext.Users.Single(u => u.Id == userId);
            
            if (isAddAction)
            {
                currentTask.Users.Add(user);
            }
            else
            {
                currentTask.Users.Remove(user);
            }
            
            dataContext.SaveChanges();
            return new EmptyResult();
        }
        /// <summary>
        /// Добавляет или удаляет ярлык из задания.
        /// </summary>
        /// <param name="taskId">Идентификатор задания.</param>
        /// <param name="labelId">Идентификатор ярлыка.</param>
        /// <param name="IsAddAction">
        /// Переменная отвечает за действие которое будет выполнятся. При "True" будет добавление ярлыка, иначе удаление из задания.
        /// </param>
        /// <returns>Возвращает пустой ответ.</returns>
        [HttpPost]
        public ActionResult AjaxSetTaskLabel(int taskId, int labelId, bool isAddAction)
        {
            TaskModel currentTask = dataContext.Tasks
                .Single(t => t.Id == taskId);

            LabelModel label = dataContext.Labels.Single(u => u.Id == labelId);

            if (isAddAction)
            {
                currentTask.Labels.Add(label);
            }
            else
            {
                currentTask.Labels.Remove(label);
            }

            dataContext.SaveChanges();
            return new EmptyResult();
        }
        /// <summary>
        /// Добавление задания.
        /// </summary>
        /// <param name="task">Задание которое нужно добавить.</param>
        /// <returns>Возвращает пустой ответ.</returns>
        [HttpPost]
        public ActionResult AjaxAddTask(TaskModel task)
        {
            // Производим вставку ярлыков по переданным идентификаторам
            if (task.Labels != null)
            {
                IEnumerable<int> labelsIds = task.Labels.Select(l => l.Id);
                task.Labels = dataContext.Labels.Where(l => labelsIds.Contains(l.Id)).ToList();
            }
            
            // Производим вставку пользователей по переданным идентификаторам
            if (task.Users != null)
            {
                IEnumerable<string> usersIds = task.Users.Select(u => u.Id);
                task.Users = dataContext.Users.Where(u => usersIds.Contains(u.Id)).ToList();
            }

            task.AlarmTime = DateTime.Now;

            string userId = User.Identity.GetUserId();
            ApplicationUser user = dataContext.Users.Single(u => u.Id == userId);
            task.Author = user;

            user.Tasks.Add(task);
            dataContext.SaveChanges();

            // Отображение
            PartialViewResult result = GetRenderedTask(task.Id);

            return result;
        }
        /// <summary>
        /// Удаление задания.
        /// </summary>
        /// <param name="taskId">Идентификатор задания.</param>
        /// <returns>Возвращает пустой ответ.</returns>
        [HttpPost]
        public ActionResult AjaxDeleteTask(int taskId)
        {
            var tasks = dataContext.Tasks.ToList();
            var userId = User.Identity.GetUserId();
            ApplicationUser user = dataContext.Users.Single(u => u.Id == userId);
            TaskModel task = user.Tasks.Single(t => t.Id == taskId);
            user.Tasks.Remove(task);
            dataContext.SaveChanges();

            //TaskModel task = dataContext.Tasks.Include(x => x.Author).Single(t => t.Id == taskId);
            //dataContext.Tasks.Remove(task);
            //dataContext.SaveChanges();
            return new EmptyResult();
        }
        /// <summary>
        /// Генерирует HTML-сегмент задания по его идентификатору
        /// </summary>
        /// <param name="id">Идентификатор задания.</param>
        /// <returns>HTML-сегмент.</returns>
        public PartialViewResult GetRenderedTask(int id)
        {
            // Находим модель по id
            TaskModel task = dataContext.Tasks.Single(t => t.Id == id);

            string userId = User.Identity.GetUserId();

            List<LabelModel> labels = dataContext.Labels.Where(x => x.Author.Id == userId).ToList();
            List<ApplicationUser> friends = dataContext.Users.Single(x => x.Id == userId).Friends.ToList();

            // Добавляем вторичные данные
            ViewBag.LabelsList = labels;
            ViewBag.FriendsList = friends;
            
            // Генерируем частичное представление
            PartialViewResult partialView = PartialView("~/Views/Shared/_Task.cshtml", task);
            
            // Возвращаем представление
            return partialView;
        }
        /// <summary>
        /// Добавление ярлыка.
        /// </summary>
        /// <param name="label">Ярлык который нужно добавить.</param>
        /// <returns>Возвращает пустой ответ.</returns>
        [HttpPost]
        public ActionResult AddLabel(LabelModel label)
        {
            string userId = User.Identity.GetUserId();
            dataContext.Users.Single(u => u.Id == userId).Labels.Add(label);
            dataContext.SaveChanges();
            Response.Write(label.Id);

            return new EmptyResult();
        }
        /// <summary>
        /// Добавление ярлыка.
        /// </summary>
        /// <param name="pattern">Сегмент по которому будет произведен поиск.</param>
        /// <returns>Возвращает пустой ответ.</returns>
        [HttpPost]
        public PartialViewResult SearchUserByNameOrEmail(string pattern)
        {
            List<ApplicationUser> users = dataContext.Users.Where(u => u.Id.Contains(pattern) || u.Email.Contains(pattern)).ToList();
            PartialViewResult viewResult = PartialView("~/Views/Shared/_ListOfFoundUsers.cshtml", users);

            return viewResult;
        }
        /// <summary>
        /// Добавить друга по идентификатору.
        /// </summary>
        /// <param name="userId">идентификатор пользователя которого нужно добавить.</param>
        /// <returns>Возвращает пустой ответ.</returns>
        [HttpPost]
        public ActionResult AddFriend(string userId)
        {
            ApplicationUser user = dataContext.Users.Single(u => u.Id == userId);
            string currentUserId = User.Identity.GetUserId();
            ApplicationUser currentUser = dataContext.Users.Single(u => u.Id == currentUserId);
            
            if (!currentUser.Friends.Contains(user))
            {
                currentUser.Friends.Add(user);
                dataContext.SaveChanges();
            }
            Response.Write(user.Id);

            return new EmptyResult();
        }

        #endregion

        #region Обработчики страниц

        public ActionResult Index()
        {
            if (User.Identity.IsAuthenticated)
            {
                return new RedirectResult("~/Home/Tasks");
            }

            return View();
        }

        
        [HttpGet]
        public ActionResult Tasks(int? page = 1)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return new RedirectResult("~/");
            }

            string userId = User.Identity.GetUserId();
            ApplicationUser user = dataContext.Users.Single(u => u.Id == userId);
            List<TaskModel> tasks = user.Tasks.OrderByDescending(x => x.Id).ToList();
            ViewBag.LabelsList = user.Labels;
            ViewBag.FriendsList = user.Friends;

            int startInt = ((int)page - 1) * PAGE_COUNT;
            int endInt = startInt + PAGE_COUNT;

            // Защита //
            if ((int)page < 1 || (startInt > tasks.Count - 1 && tasks.Count > 0)) 
            {
                return new HttpNotFoundResult($"Page '{page}', not found!");
            }

            if (endInt > tasks.Count - 1)
            {
                tasks = tasks.GetRange(startInt, tasks.Count - startInt);
            }
            else
            {
                tasks = tasks.GetRange(startInt, PAGE_COUNT);
            }
            
            return View(tasks);
        }

        #endregion
        
        #region Вспомогательные процедуры

        
        // заполнить таблицу 
        private void AddToBase()
        {
            string userId = dataContext.Users.Single(u => u.Email == "sd-2030@mail.ru").Id;
            ApplicationUser user = dataContext.Users.Single(u => u.Id == userId);

            // Друзья
            ApplicationUser uim1 = dataContext.Users.Single(u => u.Email == "sergeyklim@live.ru");
            ApplicationUser uim2 = dataContext.Users.Single(u => u.Email == "sergeyklim01@gmail.com");
            user.Friends.Add(uim1);
            user.Friends.Add(uim2);
            dataContext.SaveChanges();

            // Ярлыки
            LabelModel label1 = new LabelModel { Text = "Дом", Color = "#E00" };
            LabelModel label2 = new LabelModel { Text = "Работа", Color = "#F0F" };
            
            // Задания
            TaskModel task1 = new TaskModel
            {
                Title = "Хлебушек",
                Text = "Купить хлебушка, вспомнить что сам хлебушек",
                Labels = new List<LabelModel> { label2, label1 },
                Users = null,
                Author = user,
                AlarmTime = DateTime.Now
            };
            TaskModel task2 = new TaskModel
            {
                Title = "Отчет",
                Text = "Сдать отчет г. директору предприятия 'ЦЕСНА'",
                Labels = new List<LabelModel> { label2, label1 },
                Users = null,
                Author = user,
                AlarmTime = DateTime.Now
            };
            user.Tasks.Add(task1);
            user.Tasks.Add(task2);
            user.Labels.Add(label1);
            user.Labels.Add(label2);
            dataContext.SaveChanges();
        }
        

        #endregion
    }
    
}