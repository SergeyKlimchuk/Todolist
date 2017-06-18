using System;
using System.Collections.Generic;
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
        
        private void AddToBase()
        {
            DataContext dataContext = new DataContext();
            LabelModel label1 = new LabelModel { Name = "Дом", Color = System.Drawing.Color.Azure };
            LabelModel label2 = new LabelModel { Name = "Работа", Color = System.Drawing.Color.Purple };
            List<LabelModel> labels = new List<LabelModel> { label1, label2 };
            dataContext.LabelModels.AddRange(labels);
            dataContext.SaveChanges();

            TaskModel task1 = new TaskModel { Title = "Хлебушек", Text = "Купить злебушка, вспомнить что сам хлебушек", LabelModel = new List<LabelModel> { label1, label2 } };
            task1.AlarmTime = DateTime.Now;
            TaskModel task2 = new TaskModel { Title= "Отчет", Text="Сдать отчет г. директору предприятия 'ЦЕСНА'", LabelModel = new List<LabelModel> { label1 } };
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
            DataContext dataContext = new DataContext();
            //AddToBase();
            var taskList = dataContext.TaskModels.Include(p => p.LabelModel);
            var d = taskList.ToList()[0].LabelModel.Count();

            Response.Write(d);
            return null;
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
            

            return View(tasks);
        }
    }
}