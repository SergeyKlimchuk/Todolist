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

function SetTegsLineById(id) {
    var $element = $('.task-box#' + id);
    // Массив 
    var $LiList = $($element).find('.labels-menu li');
    // Строка с тегами
    var $tagsLine = $($element).find('.task-tags-menu');
    //$tagsLine.empty();

    for (var item = 0; item < $LiList.length; item++) {
        var $checkBox = $($LiList[item]).find('input:checkbox')[0];
        var $labelText = $($LiList[item]).find('label').text();
        console.log($checkBox);

        if ($checkBox.checked) {
            $($tagsLine).append($("<span class='label-segment pull-right'>SOME</span>"));
        }
        
        
    }
    
}
