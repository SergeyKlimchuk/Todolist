var options = [];

$('.dropdown-menu a').on('click', function (event) {

    var $target = $(event.currentTarget), // текущий объект
        val = $target.attr('data-value'), // индекс строчки
        $inp = $target.find('input'),     // ищет input
        idx;
    
    $inp[0].checked = !$inp[0].checked;

    // Статус (1: добавление атрибута, 2: удаление аттрибута)
    var $status = $inp[0].checked; // console.log("status: " + $status); // отладка
    
    // Ид задания
    var $taskId = $inp.attr('name');

    // Номер ярлыка с которым будет работа
    var $labelId = val;

    // Отправка AJAX-запроса
    $.ajax({
        url: "/Home/EditLabel",
        type: "GET",
        data: "taskId=" + $taskId + "&labelId=" + $labelId + "&actionId=" + $status,
        success: function (response) { }
    })
    
    return false;
});


$('.task-text-input').on('blur', function (event) {
    // Текст записи
    $text = $(event.currentTarget).val();
    // Ид записи
    $taskId = $(event.currentTarget).attr('name');
    //alert($text);
    //alert($taskId);
    
    $.ajax({
        url: "/Home/EditTaskText",
        type: "GET",
        data: "taskId=" + $taskId + "&text=" + $text,
        success: function (response) { }
    })
    
    return false;
});

$('.task-title-input').on('blur', function (event) {
    // Текст записи
    $text = $(event.currentTarget).val();
    // Ид записи
    $taskId = $(event.currentTarget).attr('name');
    //alert($text);
    //alert($taskId);

    $.ajax({
        url: "/Home/EditTitleText",
        type: "GET",
        data: "taskId=" + $taskId + "&title=" + $text,
        success: function (response) { }
    })

    return false;
});

$('.task-title-input, .task-text-input').on('focus', function (event) {
    var $current = $(event.currentTarget);
    var $curParrent = $current.parents('.task-box').css('box-shadow', '0 0 10px black');
    //console.log($curParrent.length);
});

$('.task-title-input, .task-text-input').on('blur', function (event) {
    var $current = $(event.currentTarget);
    var $curParrent = $current.parents('.task-box').css('box-shadow', 'none');
    //console.log($curParrent.length);
});