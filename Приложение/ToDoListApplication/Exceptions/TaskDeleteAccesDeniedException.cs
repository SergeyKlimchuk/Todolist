using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ToDoListApplication.Exceptions
{
    public class TaskDeleteAccesDeniedException : Exception
    {
        public override string Message => "Вы не являетесь автором этого задания, удаление не возможно!";

        public override string ToString()
        {
            return Message;
        }
    }
}