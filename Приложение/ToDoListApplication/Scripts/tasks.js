// Вывод всех ярлыков добавления задания
function SetLabelsAddTask() {
    //console.log("Началось!");
    // Строка с тегами
    var LabelsLine = $('.fromAdd').find('.task-tags-menu');
    // Массив 
    var LiList = $('.fromAdd').find('.labels-menu li').not('.labelAddBtn');
    // Очитса линии от предыдущих тегов
    LabelsLine.empty();

    for (var item = 0; item < LiList.length; item++) {
        var checkBox = $(LiList[item]).find('input:checkbox')[0];
        var labelText = $(LiList[item]).find('label').text();

        if (checkBox.checked) {
            $(LabelsLine).append($("<span class='label-segment pull-right'>" + labelText + "</span>"));
        }
    }
}
// Вывод всех пользователей
function SetUsersAddTask() {
    // Строка с тегами
    var UsersLine = $('.fromAdd').find('.task-users-menu');
    // Массив 
    var LiList = $('.fromAdd').find('.tool-user-changer li').not('.userAddBtn');
    // Очитса линии от предыдущих тегов
    UsersLine.empty();

    for (var item = 0; item < LiList.length; item++) {
        var checkBox = $(LiList[item]).find('input:checkbox')[0];
        var userName = $(LiList[item]).find('label').text();
        //console.log($(checkBox).checked);
        if (checkBox.checked) {
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
    var $LiList = $($element).find('.tool-user-changer li').not('.userAddBtn');
    //console.log($LiList);
    // Строка с тегами
    var $usersLine = $($element).find('.task-users-menu');
    $usersLine.empty();

    for (var item = 0; item < $LiList.length; item++) {
        var $checkBox = $($LiList[item]).find('input')[0];
        var $labelText = $($LiList[item]).find('label').text();
        if ($checkBox.checked) {
            $($usersLine).append($("<span class='label-segment pull-right'>" + $labelText + "</span>"));
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
    //console.log("taskId: " + $taskId + ", LabelId: " + $labelId + ", status: " + $labelStatus); // отладка
    SetLabelsLineById($taskId);
    return false;
}
// Редактирование пользователей
function UserEdit(event) {
    console.log("Происходит добавление");
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
    //console.log("taskId: " + $taskId + ", UserId: " + $userId + ", status: " + $userStatus); // отладка
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

function StatusEdit(event) {
    var button = $(event.currentTarget);
    var status = !button.hasClass('glyphicon-ok');
    var taskId = $(event.currentTarget).parents('.task-box').attr('id');

    if (button.hasClass('glyphicon-ok')) {
        button.removeClass('glyphicon-ok');
        button.addClass('glyphicon-remove');
    } else {
        button.removeClass('glyphicon-remove');
        button.addClass('glyphicon-ok');
    }

    console.log(taskId);

    $.ajax({
        url: "/Home/AjaxSetStatus",
        type: "POST",
        data: "taskId=" + taskId + "&status=" + status,
        success: function (response) { }
    });
}

// Отправка изменений в заголовке задачи
$('.task-title.editer input').on('blur', TaskTitleEdit);
// Удаление записи
$('.btn-exit.editer').on('click', DeleteTask);
// Отправка изменений в тексте записи
$('.task-text.editer').on('blur', TaskTextEdit);
// Отправка изменений о ярлыке задачи
$('.labels-menu.editer li').on('click', LabelEdit);
// Отправка изменений пользователей задачи
$('.users-menu.editer li').on('click', UserEdit);

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

    if ($title.trim() == "" && $text.trim() == "") {
        return false;
    }

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
        $userCheckbox = $usersCheckbox[d];
        //console.log("alarm");
        console.log($userCheckbox);
        if ($userCheckbox.checked) {
            userId = $userCheckbox.id.replace('Friend_', '');

            usersList.push({
                Id: userId
            });
        }
    }
    //console.log($usersCheckbox);
    console.log({ Text: $text, Title: $title, Labels: labelsList, Users: usersList });
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
    $task.find('.task-status').on('click', StatusEdit);

    // Показ линий
    SetLines(taskId);

    // Очистка формы добавления
    ClearAddFrom();
}

function AddNewUserToLists(response) {
    var $form = $('.userAddForm');
    var $button = $form.find('#users-result-list button.active');
    email = $button.text();
    userId = response;
    
    var $tasks = $('div.task-box');

    for (var i = 0; i < $tasks.length; i++) {
        var $currentTask = $($tasks[i]);

        var resultId = "";
        if ($($currentTask).attr('id') == null) {
            resultId = "Friend_" + userId;
        } else {
            resultId = $($currentTask).attr('id') + "_" + userId;
        }

        var $segment = $('<li><input type="checkbox" id="' + resultId + '" data-target="' + userId +
            '"><label for="' + resultId + '">' + email + '</label></li>');
        
        var $lastItem = $($currentTask).find('.userAddBtn');
        
        $segment.insertBefore($lastItem);
        
        if ($($currentTask).attr('id') == null) {
            $segment.on('click', SetUsersAddTask);
        } else {
            $segment.on('click', UserEdit);
        }
    }

    $form.find('#users-result-list').empty();
    $form.find('#user-add-name-change').val('');
    $form.find('#user-alert').show();
    $('#user-add-accept').removeClass('disabled');
    $('#user-add-accept').addClass('disabled');
}

function AddNewLabelToList(response) {
    color = $('#label-add-color-change label.active').text();
    text = $('#label-add-name-change').val();
    labelId = response;

    resultColor = "";
    switch (color) {
        case "красный":
            resultColor = "#f33"
            break;
        case "желтый":
            resultColor = "#f3f"
            break;
        case "белый":
            resultColor = "#fff"
            break;
    }

    var $tasks = $('div.task-box');
    
    for (var i = 0; i < $tasks.length; i++) {
        var $lastItem = $($tasks[i]).find('.labels-menu li.labelAddBtn');
        var $taskId = $($tasks[i]).attr('id');
        var $id = "";

        if ($taskId == null) {
            $id = "Label_" + labelId;
        } else {
            $id = $taskId + "_" + labelId;
        }
        
        var $segment = $('<li><input type="checkbox" id="' +
            $id + '" data-target="' +
            labelId + '" /><label for="' +
            $id + '">' + text + '</label></li>');

        $segment.insertBefore($lastItem);
        
        if ($taskId == null) {
            $segment.on('click', SetLabelsAddTask);
        } else {
            $segment.on('click', LabelEdit);
        }
    }

    // Очистка
    $('#label-add-color-change label.active checkbox').checked = false;
    $('#label-add-color-change label.active').removeClass('active');

    $('#label-add-color-change label').first().checked = true;
    $('#label-add-color-change label').first().addClass('active');

    text = $('#label-add-name-change').val('');

    var buttonAccept = $('#label-add-accept');
    buttonAccept.addClass('disabled');

    return null;
}

// Очистка добавляющей формы
$('.task-delete').not('.editer').on('click', ClearAddFrom);
// Показ ярлыков которые выбраны
$('.task-tools-menu').not('.editer').find('li').on('click', SetLabelsAddTask);
// Показ пользователей которые выбраны
$('.tool-user-changer').not('.editer').find('li').not('.userAddBtn').on('click', SetUsersAddTask);

$('#label-add-accept').on('click', function (event) {
    if ($(event.currentTarget).hasClass('disabled')) {
        return false;
    }

    var $object = $(event.currentTarget).parents('.labelAddForm');
    var $LabelsList = $($object).find('#label-add-color-change').first();
    var $chackedLabel = $($LabelsList).find('input:checked').parent('label');
    
    // Поиск нужных данных
    color = $($chackedLabel).text();
    text = $($object).find('#label-add-name-change').val();
    
    $.ajax({
        url: "/Home/AddLabel",
        type: "POST",
        data: { Color: color, Text: text },
        success: AddNewLabelToList
    });
    
});

$('#user-search-btn').on('click', function (event) {
    var $input = $(event.currentTarget).parent().siblings('#user-add-name-change');
    text = $($input).val();
    if (text.length < 3) {
        return null;
    }
    
    $.ajax({
        url: "/Home/SearchUserByNameOrEmail",
        type: "POST",
        data: "pattern="+text,
        success: function (result) {
            //console.log($(result));
            var $resultSegment = $($input).parent().siblings('#users-result-list');
            $resultSegment.empty();
            $resultSegment.append($('<hr />'));
            $resultSegment.append($('<h4 class="text-center"><b>Результат:</b></h4>'));

            $resultSegment.append($(result));

            // Нажатие на кнопки которые были получены от сервера
            $('#users-result-list button').not('.disabled').on('click', function (event) {
                if ($(event.currentTarget).hasClass('active')) {
                    return false;
                }
                var $element = $(event.currentTarget);
                $element.siblings('button').removeClass('active');
                $element.toggleClass('active');
                $('#user-add-accept').removeClass('disabled');
            });
        }
    });
    
});

$('#user-add-name-change').keyup(function (event) {
    textLength = $(event.currentTarget).val().length;
    var $alertPanel = $(event.currentTarget).parents('.modal-body').find('#user-alert');
    
    if (textLength > 2) {
        if ($alertPanel.is(':visible')) {
            $alertPanel.hide();
        }
    } else {
        if (!$alertPanel.is(':visible')) {
            $alertPanel.show();
        }
    }

});

$('#user-add-close').on('click', function (event) {
    var $form = $(event.currentTarget).parents('.userAddForm');
    $form.find('#users-result-list').empty();
    $form.find('#user-add-name-change').val('');
});

$('#user-add-accept').on('click', function (event) {
    if ($(event.currentTarget).hasClass('disabled')) {
        return false;
    }

    var $hasSelected = $('#users-result-list button.active');
    if ($hasSelected.length == 0) {
        return null;
    }

    var $form = $(event.currentTarget).parents('.userAddForm');
    var $usersList = $form.find('#users-result-list');
    email = $usersList.find('button.active').val();
    userId = $usersList.find('button.active').attr('id').substring(10);
    
    $.ajax({
        url: "/Home/AddFriend",
        type: "POST",
        data: "userId=" + userId,
        success: AddNewUserToLists
    });
    
});

$('#label-add-name-change').keyup(function (event) {
    var length = $(event.currentTarget).val().length;
    var buttonAccept = $('#label-add-accept');
    if (length == 0) {
        if (!buttonAccept.hasClass('disabled')) {
            buttonAccept.addClass('disabled');
        }
    } else if (buttonAccept.hasClass('disabled')) {
        buttonAccept.removeClass('disabled');
    }
});

$('.task-status').click(StatusEdit);