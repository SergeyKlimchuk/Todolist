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
        DataContext dataContext = new DataContext();
        
        #region AJAX - запросы

        public ActionResult EditTaskUser(int taskId, string userId, string actionId)
        {
            try
            {
                // Ищем запись
                TaskModel task = dataContext.Tasks.Include(t => t.UsersIds).Single(t => t.Id == taskId);
                // Пользователь который должен быть удален из задачи
                UserId user = null;
                if (actionId == "true")
                {
                    UserId userIdModel = new UserId() { Value = userId };
                    task.UsersIds.Add(userIdModel);
                }
                else
                {
                    user = task.UsersIds.Single(u => u.Value == userId);
                    // Удаляем сегмент
                    task.UsersIds.Remove(user);
                }
                
                // Сохраняем действия
                dataContext.SaveChanges();
            }
            catch
            {
                throw new Exception("Ошибка вычисления, возможно запись не была найдена!");
            }

            // Возвращаем пустой ответ
            return new EmptyResult();
        }

        public ActionResult EditLabel(int taskId, int labelId, string actionId)
        {
            // Ищем запись
            TaskModel task = dataContext.Tasks.Include(t => t.LabelModel).Where(t => t.Id == taskId).ToList()[0];
            // Ищем ярлык
            LabelModel label = dataContext.Labels.Where(l => l.Id == labelId).ToList()[0];
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
            var currentTask = dataContext.Tasks.Where(t => t.Id == taskId);

            if (currentTask == null) return null;

            currentTask.ToList()[0].Text = text;
            dataContext.SaveChanges();

            return new EmptyResult();
        }

        public ActionResult EditTitleText(int taskId, string title)
        {
            var currentTask = dataContext.Tasks.Where(t => t.Id == taskId);

            if (currentTask == null) return null;

            currentTask.ToList()[0].Title = title;
            dataContext.SaveChanges();

            return new EmptyResult();
        }

        public ActionResult DeleteTask(int taskId)
        {
            // Находим нужную запись
            TaskModel task = dataContext.Tasks.Single(t => t.Id == taskId);
            // Удаляем запись
            dataContext.Tasks.Remove(task);
            // Охраняем изменения
            dataContext.SaveChanges();
            // Возвращаем пустой результат
            return new EmptyResult();
        }

        [HttpPost]
        public ActionResult AddTaskAndGetView(TaskModel task)
        {
            // Получаем все ярлыки пользователя
            List<LabelModel> labelsList = dataContext.GetLabelsListByUserId(User.Identity.GetUserId());
            // Получаем идентификаторы ярлыков которые нужно встроить в запись
            List<int> labelsId = task.LabelModel.Select(l => l.Id).ToList();
            // Находим нужные нам ярлыки
            List<LabelModel> Goodlabels = labelsList.Where(l => labelsId.Contains(l.Id)).ToList();
            
            // Получаем все идентификаторы пользователей задания
            List<string> usersIdList = task.UsersIds.Select(f => f.Value).ToList();
            // Находим данные пользователей
            var userIdModels = dataContext.UsersIds.Where(u => usersIdList.Contains(u.Value));
            
            // Создание задания
            TaskModel fullTask = new TaskModel()
            {
                AlarmTime = DateTime.Now,
                LabelModel = Goodlabels,
                AuthorId = User.Identity.GetUserId(),
                UsersIds = userIdModels.ToList(),
                Title = task.Title,
                Text = task.Text
            };
            
            dataContext.Tasks.Add(fullTask);
            dataContext.SaveChanges();

            // Получаем идентификатор задания
            int id = fullTask.Id;

            // Генерируем html сегмент задания
            PartialViewResult partialView = GetRenderedTask(id);

            // Возвращаем html сегмент
            return partialView;
        }

        public PartialViewResult GetRenderedTask(int id)
        {
            // Находим модель по id
            TaskModel task = dataContext.Tasks.Single(t => t.Id == id);

            // Добавляем вторичные данные
            ViewBag.LabelsList = dataContext.GetLabelsListByUserId(User.Identity.GetUserId());
            ViewBag.FriendsList = dataContext.GetUserFriendsByUserId(User.Identity.GetUserId());

            // Генерируем частичное представление
            PartialViewResult partialView = PartialView("~/Views/Shared/_Task.cshtml", task);
            
            // Возвращаем представление
            return partialView;
        }

        #endregion

        #region Обработчики страниц

        public ActionResult Index()
        {
            
            
            return View();
        }

        [HttpGet]
        public ActionResult Tasks(int? page = null)
        {
            var userId = User.Identity.GetUserId();

            var tasksList = dataContext.GetUserTasksByUserId(userId);
            
            // Перенаправление если не авторизован
            if (!User.Identity.IsAuthenticated) Response.Redirect("/");
            
            // Проверка на пустой аргумент
            if (page == null) page = 1;

            // Декриментируем для упрощения алгоритма
            page--;
            
            // Если страница меньше нуля выбивает ошибку.
            if (page < 0) return new HttpNotFoundResult("Page not found! (Out of range <)");

            // Вычисление промежуточных переменных
            int pageStart = Convert.ToInt32(page) * PAGE_COUNT;
            int pageStop = pageStart + PAGE_COUNT - 1;
            int recordsCount = tasksList.Count();

            // Проверка на выход
            if (pageStart > recordsCount) return new HttpNotFoundResult("Page not found (Out of range >)!");
            
            // Если запрашиваемая страница будет отображена не полностью
            int countTasks = pageStop > recordsCount ? recordsCount - pageStart : PAGE_COUNT;

            // Задания на вывод
            List<TaskModel> tasks = tasksList.ToList().GetRange(pageStart, countTasks);
            // Форматирвоание листов
            ViewBag.LabelsList = dataContext.GetLabelsListByUserId(User.Identity.GetUserId());
            ViewBag.FriendsList = dataContext.GetUserFriendsByUserId(User.Identity.GetUserId());

            return View(tasks);
        }

        #endregion
        
        #region Вспомогательные процедуры

        // заполнить таблицу 
        private void AddToBase()
        {
            string userId = User.Identity.GetUserId();
            DataContext dataContext = new DataContext();
            LabelModel label1 = new LabelModel { Name = "Дом", Color = System.Drawing.Color.Azure, AuthorId = userId };
            LabelModel label2 = new LabelModel { Name = "Работа", Color = System.Drawing.Color.Purple, AuthorId = userId };
            List<LabelModel> labels = new List<LabelModel> { label1, label2 };
            dataContext.Labels.AddRange(labels);
            dataContext.SaveChanges();


            ApplicationDbContext usersContext = new ApplicationDbContext();
            ApplicationUser uim1 = usersContext.Users.Single(u => u.Email == "211572@mail.ru");
            ApplicationUser uim2 = usersContext.Users.Single(u => u.Email == "sergeyklim01@gmail.com");


            UserFriend userFriend1 = new UserFriend()
            {
                FirstUser = userId,
                SecondUser = uim1.Id
            };
            UserFriend userFriend2 = new UserFriend()
            {
                FirstUser = userId,
                SecondUser = uim2.Id
            };

            dataContext.Friends.AddRange(new List<UserFriend>() {
                userFriend1,
                userFriend2
            });
            dataContext.SaveChanges();


            UserId userId1 = new UserId() { Value = uim1.Id };
            UserId userId2 = new UserId() { Value = uim2.Id };
            TaskModel task1 = new TaskModel
            {
                Title = "Хлебушек",
                Text = "Купить хлебушка, вспомнить что сам хлебушек",
                LabelModel = new List<LabelModel> { label1, label2 },
                AuthorId = userId,
                UsersIds = new List<UserId> { userId1, userId2 }
            };
            task1.AlarmTime = DateTime.Now;
            TaskModel task2 = new TaskModel
            {
                Title = "Отчет",
                Text = "Сдать отчет г. директору предприятия 'ЦЕСНА'",
                LabelModel = new List<LabelModel> { label1 },
                AuthorId = userId,
                UsersIds = new List<UserId> { userId2 }
            };
            task2.AlarmTime = DateTime.Now;
            dataContext.Tasks.AddRange(new List<TaskModel> { task1, task2 });
            dataContext.SaveChanges();
        }

        #endregion
    }


    
    
}