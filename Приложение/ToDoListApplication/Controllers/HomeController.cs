using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ToDoListApplication.Models;

namespace ToDoListApplication.Controllers
{
    public class HomeController : Controller
    {
        // Контекст данных
        TaskViewModels dataContext;
        // Кол-во записей на странице
        const int PAGE_COUNT = 10;
        
        private void AddToBase()
        {
            dataContext = new TaskViewModels();
            Label label1 = new Label("Дом", System.Drawing.Color.Azure);
            Label label2 = new Label("Работа", System.Drawing.Color.Purple);
            List<Label> labels = new List<Label> { label1, label2 };
            dataContext.Labels.AddRange(labels);

            TaskRecord task1 = new TaskRecord("Хлебушек", "Купить злебушка, вспомнить что сам хлебушек");
            task1.AlarmTime = DateTime.Now;
            TaskRecord task2 = new TaskRecord("Отчет", "Сдать отчет г. директору предприятия 'ЦЕСНА'");
            task2.AlarmTime = DateTime.Now;
            dataContext.TaskRecords.AddRange(new List<TaskRecord> { task1, task2 });
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
            
            // Подключение  контекста
            dataContext = new TaskViewModels();

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
            int recordsCount = dataContext.TaskRecords.Count();

            // Проверка на выход
            if (pageStart > recordsCount) return new HttpNotFoundResult("Page not found (Out of range >)!");

            // Задания на вывод
            List<TaskRecord> tasks;

            // Если запрашиваемая страница будет отображена не полностью
            if (pageStop > recordsCount)
            {
                int countTasks = recordsCount - pageStart;

                tasks = dataContext.TaskRecords.ToList().GetRange(pageStart, countTasks);

            }
            else
            {
                tasks = dataContext.TaskRecords.ToList().GetRange(pageStart, PAGE_COUNT);
            }
            

            return View(tasks);
        }
    }
}