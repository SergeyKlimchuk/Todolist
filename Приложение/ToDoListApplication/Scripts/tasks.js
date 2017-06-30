// Отправка изменений о теге задачи
$('.dropdown-menu.labels-menu.editer li').on('click', function (event) {

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
});

// Отправка изменений пользователей задачи
$('.dropdown-menu.users-menu.editer li').on('click', function (event) {

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
});

// Устанавливаем тень при входе в диапозон формы
$('.task-box').on('mouseover', function () {
    $(this).css('box-shadow', '0 0 10px black');
});

// Убираем тень при выход из формы
$('.task-box').on('mouseout', function () {
    $(this).css('box-shadow', '');
});

// Отправка изменений в тексте записи
$('.task-text.editer').on('blur', function (event) {
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
    console.log("tex: " + $text + ", taskId: " + $taskId);
    return false;
});

// Отправка изменений в заголовке задачи
$('.task-title.editer input').on('blur', function (event) {
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
});

// Автоувеличение формы ввода текста (позаимствовал)
$('textarea').on('keydown', function () {
    var el = this;
    setTimeout(function () {
        el.style.cssText = 'height:auto; padding:0';
        // for box-sizing other than "content-box" use:
        // el.style.cssText = '-moz-box-sizing:content-box';
        el.style.cssText = 'height:' + el.scrollHeight + 'px';
    }, 0);
});

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
        console.log($checkBox);

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
        console.log($checkBox);

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

// Выполнение заполнений для всех заданий
$(function () {
    $tasks = $('.task-box');
    if ($tasks.length > 1) {
        for (var item = 1; item < $tasks.length; item++) {
            var id = $($tasks[item]).attr('id');
            SetLines(id);
        }
    }
});

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
}

function AddTaskSegment(segment) {
    $(segment).insertAfter('.fromAdd');
}

$('.task-delete.editer span').on('click', function (event) {
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
        data: "taskId=" + $taskId,
        success: function (response) { }
    })

    $segment.remove();
    return false;
});

$('.task-delete').not('.editer').on('click', function (event) {
    ClearAddFrom();
});

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
        success: function (response) {
            console.log(response);
            AddTaskSegment(response)
            ClearAddFrom();
        }
    })
    
});
