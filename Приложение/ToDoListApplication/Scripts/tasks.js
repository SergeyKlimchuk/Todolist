
// Вывод всех ярлыков добавления задания
function SetLabelsAddTask() {
    // Строка с тегами
    var $LabelsLine = $('.fromAdd').find('.task-tags-menu');
    // Массив 
    var $LiList = $('.fromAdd').find('.labels-menu li');
    // Очитса линии от предыдущих тегов
    $LabelsLine.empty();

    for (var item = 0; item < $LiList.length; item++) {
        var $checkBox = $($LiList[item]).find('input:checkbox')[0];
        var $labelText = $($LiList[item]).find('label').text();

        if ($checkBox.checked) {
            $($LabelsLine).append($("<span class='label-segment pull-right'>" + $labelText + "</span>"));
        }
    }
}
// Вывод всех пользователей
function SetUsersAddTask() {
    // Строка с тегами
    var $UsersLine = $('.fromAdd').find('.task-users-menu');
    // Массив 
    var $LiList = $('.fromAdd').find('.tool-user-changer li');
    // Очитса линии от предыдущих тегов
    $UsersLine.empty();

    for (var item = 0; item < $LiList.length; item++) {
        var $checkBox = $($LiList[item]).find('input:checkbox')[0];
        var $userName = $($LiList[item]).find('label').text();

        if ($checkBox.checked) {
            $($UsersLine).append($("<span class='label-segment pull-right'>" + $userName + "</span>"));
        }
    }
}
// Очистка формы добавления
function ClearAddFrom() {
    $title = $("input[name='TaskTitle']")[0];
    $text = $("textarea[name='TaskText']")[0];
    $labels = $("ul[name='LabelsList'] input[type='checkbox']");
    $users = $("ul[name='UsersList'] input[type='checkbox']");

    // Очищаем
    $($title).val("");
    $($text).val("");
    for (var i = 0; i < $labels.length; i++) { $labels[i].checked = false; }
    for (var i = 0; i < $users.length; i++) { $users[i].checked = false; }
    // Очищаем линию ярлыков
    $('.fromAdd').find('.task-tags-menu').empty();
    // Очищаем линию пользователей
    $('.fromAdd').find('.task-users-menu').empty();
}

// Удаление задания
function DeleteTask(event) {
    var confirmation = confirm('Ahtung! You are trying delete this record, you know what are you doing?');

    if (!confirmation) {
        return false;
    }

    var $taskId = $(event.currentTarget).attr('data-target');
    var $segment = $(event.currentTarget).parents('.task-box');

    // Отправляем AJAX-запрос
    $.ajax({
        url: "/Home/DeleteTask",
        type: "GET",
        data: "taskId=" + $taskId
    })

    $segment.remove();
};
// Заполнение линии тегов
function SetLabelsLineById(id) {
    var $element = $('.task-box#' + id);
    // Массив 
    var $LiList = $($element).find('.labels-menu li');
    // Строка с тегами
    var $tagsLine = $($element).find('.task-tags-menu');
    $tagsLine.empty();

    for (var item = 0; item < $LiList.length; item++) {
        var $checkBox = $($LiList[item]).find('input:checkbox')[0];
        var $labelText = $($LiList[item]).find('label').text();
        //console.log($checkBox);

        if ($checkBox.checked) {
            $($tagsLine).append($("<span class='label-segment pull-right'>" + $labelText + "</span>"));
        }
    }

}
// Заполнение панели пользователей
function SetUsersLineById(id) {
    var $element = $('.task-box#' + id);
    // Массив 
    var $LiList = $($element).find('.tool-user-changer li');
    // Строка с тегами
    var $tagsLine = $($element).find('.task-users-menu');
    $tagsLine.empty();

    for (var item = 0; item < $LiList.length; item++) {
        var $checkBox = $($LiList[item]).find('input:checkbox')[0];
        var $labelText = $($LiList[item]).find('label').text();
        //console.log($checkBox);

        if ($checkBox.checked) {
            $($tagsLine).append($("<span class='label-segment pull-right'>" + $labelText + "</span>"));
        }
    }

}
// Заполнение всех линий
function SetLines(id) {
    SetLabelsLineById(id);
    SetUsersLineById(id);
}
// Редактирование ярлыков
function LabelEdit(event) {

    // Текущий элемент
    var $current = $(event.currentTarget);
    // Checkbox
    var $checkbox = $current.find('input');

    // Берем ид записи
    $taskId = $current.parents('.task-box').attr('id');
    // Берем ид ярлыка
    $labelId = $checkbox.attr('data-target');
    // Берем статус
    $labelStatus = !$checkbox[0].checked;
    // Меняем значение checkbox'а
    $checkbox[0].checked = $labelStatus;

    // Отправляем AJAX-запрос
    $.ajax({
        url: "/Home/EditLabel",
        type: "GET",
        data: "taskId=" + $taskId + "&labelId=" + $labelId + "&actionId=" + $labelStatus,
        success: function (response) { }
    });

    // Отладка
    //console.log("taskId: " + $taskId + ", LabelId: " + $labelId + ", status: " + $labelStatus); // отладка
    SetLabelsLineById($taskId);
    return false;
}
// Редактирование пользователей
function UserEdit(event) {

    // Текущий элемент
    var $current = $(event.currentTarget);
    // Checkbox
    var $checkbox = $current.find('input');

    // Берем ид записи
    $taskId = $current.parents('.task-box').attr('id');
    // Берем ид ярлыка
    $userId = $checkbox.attr('data-target');
    // Берем статус
    $userStatus = !$checkbox[0].checked;
    // Меняем значение checkbox'а
    $checkbox[0].checked = $userStatus;

    // Отправляем AJAX-запрос
    $.ajax({
        url: "/Home/EditTaskUser",
        type: "GET",
        data: "taskId=" + $taskId + "&userId=" + $userId + "&actionId=" + $userStatus,
        success: function (response) { }
    });

    // Отладка
    //console.log("taskId: " + $taskId + ", LabelId: " + $labelId + ", status: " + $labelStatus); // отладка
    SetUsersLineById($taskId);
    return false;
}
// Изменение текста задания
function TaskTextEdit(event) {
    // Берем текст записи
    $text = $(event.currentTarget).val();
    // Берем уникальный идентификатор записи
    $taskId = $(event.currentTarget).attr('name');

    // Отправляем AJAX-запрос
    $.ajax({
        url: "/Home/EditTaskText",
        type: "GET",
        data: "taskId=" + $taskId + "&text=" + $text,
        success: function (response) { }
    })

    // Отладка
    //console.log("tex: " + $text + ", taskId: " + $taskId);
    return false;
}
// Изменение заголовка задания
function TaskTitleEdit(event) {
    // Берем текст заголовка записи
    $text = $(event.currentTarget).val();
    // Берем уникальный идентификатор записи
    $taskId = $(event.currentTarget).attr('name');

    // Отправляем AJAX-запрос
    $.ajax({
        url: "/Home/EditTitleText",
        type: "GET",
        data: "taskId=" + $taskId + "&title=" + $text,
        success: function (response) { }
    })

    // Отладка
    //console.log("tex: " + $text + ", taskId: " + $taskId);
    return false;
}

// Отображение тени
function ShowShadow() {
    $(this).css('box-shadow', '0 0 10px black');
}
// Убираем тень
function HideShadow() {
    $(this).css('box-shadow', '');
}
// Гибгое изменение размера текстового поля
function TextAreaResize() {
    var el = this;
    setTimeout(function () {
        el.style.cssText = 'height:auto; padding:0';
        // for box-sizing other than "content-box" use:
        // el.style.cssText = '-moz-box-sizing:content-box';
        el.style.cssText = 'height:' + el.scrollHeight + 'px';
    }, 0);
}

// Отправка изменений в заголовке задачи
$('.task-title.editer input').on('blur', TaskTitleEdit);
// Удаление записи
$('.task-delete.editer span').on('click', DeleteTask);
// Отправка изменений в тексте записи
$('.task-text.editer').on('blur', TaskTextEdit);
// Отправка изменений о ярлыке задачи
$('.dropdown-menu.labels-menu.editer li').on('click', LabelEdit);
// Отправка изменений пользователей задачи
$('.dropdown-menu.users-menu.editer li').on('click', UserEdit);


// Устанавливаем тень при входе в диапозон формы
$('.task-box').on('mouseover', ShowShadow);
// Убираем тень при выход из формы
$('.task-box').on('mouseout', HideShadow);
// Автоувеличение формы ввода текста (позаимствовал)
$('textarea').on('keydown', TextAreaResize);


// Выполнение заполнения линий для всех заданий
$(function () {
    $tasks = $('.task-box');
    if ($tasks.length > 1) {
        for (var item = 1; item < $tasks.length; item++) {
            var id = $($tasks[item]).attr('id');
            SetLines(id);
        }
    }
});
// Добавление задания
$('#addBtn').on('click', function () {
    $title = $($("input[name='TaskTitle']")[0]).val();
    $text = $($("textarea[name='TaskText']")[0]).val();
    $labelsCheckbox = $("ul[name='LabelsList'] input[type='checkbox']");
    $usersCheckbox = $("ul[name='UsersList'] input[type='checkbox']");

    labelsList = [];
    for (var i = 0; i < $labelsCheckbox.length; i++) {
        $labelCheckbox = $labelsCheckbox[i];
        if ($labelCheckbox.checked) {
            labelId = $labelCheckbox.id.replace('Label_', '');

            labelsList.push({
                Id: labelId
            });
        }
    }

    usersList = [];
    for (var i = 0; i < $usersCheckbox.length; i++) {
        $userCheckbox = $usersCheckbox[i];
        if ($userCheckbox.checked) {
            userId = $userCheckbox.id.replace('Friend_', '');

            usersList.push({
                FriendId: userId
            });
        }
    }
    
    // Отправляем AJAX-запрос
    $.ajax({
        url: "/Home/AddTaskAndGetView",
        type: "POST",
        data: { Text: $text, Title: $title, LabelModel: labelsList, Friend: usersList },
        success: AddNewTask
    })
    
});
// Добавление задания по возвращенному ответу
function AddNewTask(response) {
    // Отображение принятого сегмента (отладка)
    //console.log(response);

    // Идентификатор задания
    taskId = $(response).find('.task-box').attr('id');

    // Добавление сегмента из принятого
    $(response).insertAfter('.fromAdd');

    // Показ линий
    SetLines(taskId);

    // Находим задание
    var $task = $('.task-box#' + taskId);
    // Добавляем возможность удаления
    $task.find('.task-delete.editer span').on('click', DeleteTask);
    // Добавляем возможность редактирования ярлыков
    $task.find('.dropdown-menu.labels-menu.editer li').on('click', LabelEdit);
    // Добавляем возможность редактирования пользователей
    $task.find('.dropdown-menu.users-menu.editer li').on('click', UserEdit);
    // Добавляем возможность изменить заголовок
    $task.find('.task-title.editer input').on('blur', TaskTitleEdit);
    // Добавляем возможность изменить текст
    $task.find('.task-text.editer').on('blur', TaskTextEdit);

    // Очистка формы добавления
    ClearAddFrom();
}


// Очистка добавляющей формы
$('.task-delete').not('.editer').on('click', ClearAddFrom);
// Показ ярлыков которые выбраны
$('.task-tools-menu').not('.editer').find('li').on('click', SetLabelsAddTask);
// Показ пользователей которые выбраны
$('.tool-user-changer').not('.editer').find('li').on('click', SetUsersAddTask);
