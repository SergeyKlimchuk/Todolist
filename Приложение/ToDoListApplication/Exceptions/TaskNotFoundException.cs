using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ToDoListApplication.Exceptions
{
    public class TaskNotFoundException : Exception
    {
        public override string Message => "Задание не найдено!";

        public override string ToString()
        {
            return Message;
        }
    }
}