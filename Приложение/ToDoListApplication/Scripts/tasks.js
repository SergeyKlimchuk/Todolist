
// Вывод всех ярлыков добавления задания
function SetLabelsAddTask() {
    // Строка с тегами
    var $LabelsLine = $('.fromAdd').find('.task-tags-menu');
    // Массив 
    var $LiList = $('.fromAdd').find('.labels-menu li').not('.labelAddBtn');
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

        if ($($checkBox).checked) {
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
    for (var d = 0; d < $users.length; d++) { $users[d].checked = false; }
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
        url: "/Home/AjaxDeleteTask",
        type: "POST",
        data: "taskId=" + $taskId
    })

    $segment.remove();
};
// Заполнение линии тегов
function SetLabelsLineById(id) {
    var $element = $('.task-box#' + id);
    // Массив 
    var $LiList = $($element).find('.labels-menu li').not('.labelAddBtn');
    // Строка с тегами
    var $tagsLine = $($element).find('.task-tags-menu');
    $tagsLine.empty();

    for (var item = 0; item < $LiList.length; item++) {
        var $checkBox = $($LiList[item]).find('input:checkbox')[0];
        var $labelText = $($LiList[item]).find('label').text();
        //console.log($checkBox.checked);

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
    $labelStatus = !($checkbox[0].checked);
    // Меняем значение checkbox'а
    $checkbox[0].checked = $labelStatus;

    // Отправляем AJAX-запрос
    $.ajax({
        url: "/Home/AjaxSetTaskLabel",
        type: "POST",
        data: "taskId=" + $taskId + "&labelId=" + $labelId + "&isAddAction=" + $labelStatus,
        success: function (response) { }
    });

    // Отладка
    console.log("taskId: " + $taskId + ", LabelId: " + $labelId + ", status: " + $labelStatus); // отладка
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
        url: "/Home/AjaxSetTaskUser",
        type: "POST",
        data: "taskId=" + $taskId + "&userId=" + $userId + "&isAddAction=" + $userStatus,
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
        url: "/Home/AjaxSetTaskText",
        type: "POST",
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
        url: "/Home/AjaxSetTaskTitle",
        type: "POST",
        data: "taskId=" + $taskId + "&text=" + $text,
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
$('.btn-exit.editer').on('click', DeleteTask);
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
    for (var d = 0; d < $usersCheckbox.length; d++) {
        $userCheckbox = $usersCheckbox[i];
        if ($userCheckbox.checked) {
            userId = $userCheckbox.id.replace('Friend_', '');

            usersList.push({
                Id: userId
            });
        }
    }
    //console.log({ Text: $text, Title: $title, Labels: labelsList, Users: usersList });
    // Отправляем AJAX-запрос
    $.ajax({
        url: "/Home/AjaxAddTask",
        type: "POST",
        data: { Text: $text, Title: $title, Labels: labelsList, Users: usersList },
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
    
    // Находим задание
    var $task = $('.task-box#' + taskId);
    // Добавляем возможность удаления
    $task.find('.btn-exit.editer').on('click', DeleteTask);
    // Добавляем возможность редактирования ярлыков
    $task.find('.dropdown-menu.labels-menu.editer li').not('.labelAddBtn').on('click', LabelEdit);
    // Добавляем возможность редактирования пользователей
    $task.find('.dropdown-menu.users-menu.editer li').not('.userAddBtn').on('click', UserEdit);
    // Добавляем возможность изменить заголовок
    $task.find('.task-title.editer input').on('blur', TaskTitleEdit);
    // Добавляем возможность изменить текст
    $task.find('.task-text.editer').on('blur', TaskTextEdit);

    // Показ линий
    SetLines(taskId);

    // Очистка формы добавления
    ClearAddFrom();
}


// Очистка добавляющей формы
$('.task-delete').not('.editer').on('click', ClearAddFrom);
// Показ ярлыков которые выбраны
$('.task-tools-menu').not('.editer').find('li').on('click', SetLabelsAddTask);
// Показ пользователей которые выбраны
$('.tool-user-changer').not('.editer').find('li').on('click', SetUsersAddTask);

$('#label-add-accept').on('click', function (event) {

    var $object = $(event.currentTarget).parents('.labelAddForm');
    // Очистка
    var $LabelsList = $($object).find('#label-add-color-change').first();
    var $chackedLabel = $($LabelsList).find('input:checked').parent('label');
    var $firstLabel = $($LabelsList).find('label').first();

    $($chackedLabel).removeClass('active');
    $($chackedLabel).find('input').checked = false;
    $($firstLabel).addClass('active');
    $($firstLabel).find('input').checked = true;

    //console.log($firstLabel);
    color = $($chackedLabel).text();
    text = $($object).find('#label-add-name-change').val();
    $($object).find('#label-add-name-change').val('');

    $.ajax({
        url: "/Home/AddLabel",
        type: "POST",
        data: { Color: color, Text: text },
        success: function (result) {
            component = $('<li><input type="checkbox" id="Label_' + result + '" /><label for="Label_' + result + '">' + text + '</label></li>');
            $('.labels-menu .labelAddBtn').before(component);
            //console.log(component);
            $(component).on('click', SetLabelsAddTask);
        }
    });
    
});

$('#user-search-btn').on('click', function (event) {
    var $input = $(event.currentTarget).parent().siblings('#user-add-name-change');
    text = $($input).val();
    console.log("start search with: text='" + text + "'");


    $.ajax({
        url: "/Home/SearchUserByNameOrEmail",
        type: "POST",
        data: "pattern="+text,
        success: function (result) {
            console.log($(result));
            var $resultSegment = $($input).parent().siblings('#users-result-list');
            $resultSegment.empty();
            $resultSegment.append($(result));


            $('#users-result-list button').on('click', function (event) {
                var $element = $(event.currentTarget);
                $element.siblings('button').removeClass('active');
                $element.toggleClass('active');

            });


        }
    });
    
});

$('#user-add-close').on('click', function (event) {
    var $form = $(event.currentTarget).parents('.labelAddForm');
    $form.find('#users-result-list').empty();
    $form.find('#user-add-name-change').val('');
});

$('#user-add-accept').on('click', function (event) {
    var $form = $(event.currentTarget).parents('.labelAddForm');
    var $usersList = $form.find('#users-result-list');
    userId = $usersList.find('button.active').attr('id').substring(10);

    $.ajax({
        url: "/Home/AddFriend",
        type: "POST",
        data: "userId=" + userId,
        success: function (result) {
            //var $segment = $('<li><input type="checkbox" id="@index" data-target="@friend.Id" @check><label for="@index">@friend.Email</label></li>');

            //<li><input type="checkbox" id="@index" data-target="@friend.Id" @check><label for="@index">@friend.Email</label></li>




            $form.find('#users-result-list').empty();
            $form.find('#user-add-name-change').val('');
        }
    });
    
});