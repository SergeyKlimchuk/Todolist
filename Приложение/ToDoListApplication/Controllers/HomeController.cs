using System;
using System.Collections.Generic;
using Microsoft.AspNet.Identity;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ToDoListApplication.Models;

namespace ToDoListApplication.Controllers
{
    public class HomeController : Controller
    {
        // Кол-во записей на странице
        const int PAGE_COUNT = 10;
        

        // Нужно добавлять ярлыки при помощи AJAX запросов.
        private void AddLabel(LabelModel label)
        {
            // Подключаемся к базе
            DataContext dataContext = new DataContext();

            dataContext.LabelModels.Add(label);
            dataContext.SaveChanges();
        }

        private void AddTask(TaskModel task)
        {
            // Подключаемся к базе
            DataContext dataContext = new DataContext();

            dataContext.TaskModels.Add(task);
            dataContext.SaveChanges();
        }

        public ActionResult EditLabel(int taskId, int labelId, string actionId)
        {
            // ищем запись по ид
            // ищем ярлык по ид
            // проверяем на присетствие этого ярлыка в списке ярлыков записи


            /* Если действие будет направленно на добавление
             * TRUE:
             *      (если ярлыка нет в списке - то добавим), (если есть - ничего не делаем, возможно ошибочный запрос)
             * FALSE:
             *      (если ярлыка нет - ничего не делаем), (если есть -удаляем его из списка)
             */

            // сохраняем
            
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

        private void AddToBase()
        {
            string userId = User.Identity.GetUserId();
            DataContext dataContext = new DataContext();
            LabelModel label1 = new LabelModel { Name = "Дом", Color = System.Drawing.Color.Azure, AuthorId= userId };
            LabelModel label2 = new LabelModel { Name = "Работа", Color = System.Drawing.Color.Purple, AuthorId = userId };
            List<LabelModel> labels = new List<LabelModel> { label1, label2 };
            dataContext.LabelModels.AddRange(labels);
            dataContext.SaveChanges();

            TaskModel task1 = new TaskModel { Title = "Хлебушек", Text = "Купить хлебушка, вспомнить что сам хлебушек", LabelModel = new List<LabelModel> { label1, label2 }, AuthorId = userId };
            task1.AlarmTime = DateTime.Now;
            TaskModel task2 = new TaskModel { Title= "Отчет", Text="Сдать отчет г. директору предприятия 'ЦЕСНА'", LabelModel = new List<LabelModel> { label1 }, AuthorId = userId };
            task2.AlarmTime = DateTime.Now;
            dataContext.TaskModels.AddRange(new List<TaskModel> { task1, task2 });
            dataContext.SaveChanges();
        }

        public ActionResult Index()
        {
            //dataContext = new TaskViewModels();
            
            return View();
        }

        [HttpGet]
        public ActionResult Tasks(int? page = null)
        {
            // Контекст данных
            DataContext dataContext = new DataContext(); //AddToBase();
            
            var taskList = dataContext.TaskModels.Include(p => p.LabelModel);

            var userId = User.Identity.GetUserId();

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
    }
}