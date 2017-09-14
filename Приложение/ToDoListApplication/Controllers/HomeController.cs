using System;
using System.Collections.Generic;
using Microsoft.AspNet.Identity;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ToDoListApplication.Models;
using System.Data.SqlClient;
using ToDoListApplication.Exceptions;

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
                .Where(t => t.Id == taskId).FirstOrDefault();

            ApplicationUser user = dataContext.Users.Where(u => u.Id == userId).FirstOrDefault();
            
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
                .Where(t => t.Id == taskId).FirstOrDefault();

            LabelModel label = dataContext.Labels.Where(u => u.Id == labelId).FirstOrDefault();

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
            // Т.к. передаются только идентификаторы соединять будем вручную
            if (task.Labels != null)
                task.Labels = task.Labels.Join(dataContext.Labels, 
                    d => d.Id, l => l.Id, 
                    (d, l) => l).ToList();
            if (task.Users != null)
                task.Users = task.Users.Join(dataContext.Users, 
                    d => d.Id, l => l.Id, 
                    (d, l) => l).ToList();

            //TODO: Реализовать оповещения
            task.AlarmTime = DateTime.Now;
            
            ApplicationUser user = GetCurrentUser();
            
            task.Author_id = user;

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
            // Находим задание
            TaskModel task = dataContext.Tasks.FirstOrDefault(t => t.Id == taskId);
            // Если задание не найдено
            if (task == null)
                throw new TaskNotFoundException();
            
            ApplicationUser user = GetCurrentUser();
            // Удалить задание может только автор
            if (task.Author_id == user)
            {
                dataContext.Tasks.Remove(task);
            }
            else
            {
                // Если пользователь содержится в списке просматривающих он может отписаться
                if (task.Users.Contains(user))
                {
                    task.Users.Remove(user);
                }
                else
                    throw new TaskDeleteAccesDeniedException();
                
            }
            // Сохраняем изминения
            dataContext.SaveChanges();
            
            return new EmptyResult();
        }
        /// <summary>
        /// Генерирует HTML-сегмент задания по его идентификатору
        /// </summary>
        /// <param name="id">Идентификатор задания.</param>
        /// <returns>HTML-сегмент.</returns>
        public PartialViewResult GetRenderedTask(int id)
        {
            // Находим задание по id
            TaskModel task = dataContext.Tasks.Single(t => t.Id == id);
            // Добавляем перечень всех ярлыков
            ViewBag.LabelsList = GetCurrentUser().Labels.ToList();
            // Добавляем перечень всех друзей
            ViewBag.FriendsList = GetCurrentUser().Friends.ToList();
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
            GetCurrentUser().Labels.Add(label);
            dataContext.SaveChanges();
            JsonResult result = new JsonResult() { Data = Json(new { label.Id, label.Color }) };
            return result;
        }
        /// <summary>
        /// Добавление ярлыка.
        /// </summary>
        /// <param name="pattern">Сегмент по которому будет произведен поиск.</param>
        /// <returns>Возвращает пустой ответ.</returns>
        [HttpPost]
        public PartialViewResult SearchUserByNameOrEmail(string pattern)
        {
            // Находим пользователей со схожим иминем или почтой
            List<ApplicationUser> users = dataContext.Users.Where(u => u.Id.Contains(pattern) || u.Email.Contains(pattern)).ToList();
            // Находим текущего пользователя
            ApplicationUser currentUser = GetCurrentUser();
            // Проверка: вдруг пользователь решил найти себя
            if (users.Contains(currentUser))
                users.Remove(currentUser);
            // Проверка: если найдены пользователи которые уже у пользователя в друзьях
            users.RemoveAll(x => currentUser.Friends.Contains(x));

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
            ApplicationUser newFriend = dataContext.Users.Single(u => u.Id == userId);
            ApplicationUser currentUser = GetCurrentUser();

            if (currentUser.Friends.Contains(newFriend))
                throw new Exception("Пользователь уже в друзьях!");

            currentUser.Friends.Add(newFriend);
            dataContext.SaveChanges();
            Response.Write(newFriend.Id);

            return new EmptyResult();
        }
        /// <summary>
        /// Устанавливает принятый статус к заданию по идентификатору.
        /// </summary>
        /// <param name="taskId">Идентификатор задания.</param>
        /// <param name="status">Статус задания.</param>
        /// <returns>Возвращает пустой ответ.</returns>
        [HttpPost]
        public ActionResult AjaxSetStatus(int taskId, string status)
        {
            dataContext.Tasks
                .Single(t => t.Id == taskId)
                .Status = status == "true";

            dataContext.SaveChanges();
            return new EmptyResult();
        }

        #endregion

        #region Обработчики страниц

        public ActionResult Index()
        {
            if (User.Identity.IsAuthenticated)
            {
                try
                {
                    ApplicationUser user = GetCurrentUser();
                }
                catch
                {
                    return View();
                }


                return new RedirectResult("~/Home/Tasks");
            }

            return View();
        }

        
        [HttpGet]
        public ActionResult Tasks(int? page = 1)
        {
            ApplicationUser user = null;

            if (!User.Identity.IsAuthenticated)
            {
                return new RedirectResult("~/");
            }
            else
            {
                try
                {
                    user = GetCurrentUser();
                }
                catch
                {
                    return new RedirectResult("~/");
                }
            }
            
            List<TaskModel> tasks = user.Tasks.OrderByDescending(x => x.Id).ToList();
            tasks.AddRange(dataContext.Tasks.Where(t => t.Users.Select(u => u.Id).Contains(user.Id)));
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
                Author_id = user,
                AlarmTime = DateTime.Now
            };
            TaskModel task2 = new TaskModel
            {
                Title = "Отчет",
                Text = "Сдать отчет г. директору предприятия 'ЦЕСНА'",
                Labels = new List<LabelModel> { label2, label1 },
                Users = null,
                Author_id = user,
                AlarmTime = DateTime.Now
            };
            user.Tasks.Add(task1);
            user.Tasks.Add(task2);
            user.Labels.Add(label1);
            user.Labels.Add(label2);
            dataContext.SaveChanges();
        }
        
        // Получаем текущего пользователя
        protected ApplicationUser GetCurrentUser()
        {
            string userId = User.Identity.GetUserId();
            return dataContext.Users.Single(u => u.Id == userId);
        }

        #endregion
    }
    
}