// �������� ��������� � ���� ������
$('.dropdown-menu.labels-menu.editer li').on('click', function (event) {

    // ������� �������
    var $current = $(event.currentTarget);
    // Checkbox
    var $checkbox = $current.find('input');

    // ����� �� ������
    $taskId = $current.parents('.task-box').attr('id');
    // ����� �� ������
    $labelId = $checkbox.attr('data-target');
    // ����� ������
    $labelStatus = !$checkbox[0].checked;
    // ������ �������� checkbox'�
    $checkbox[0].checked = $labelStatus;

    // ���������� AJAX-������
    $.ajax({
        url: "/Home/EditLabel",
        type: "GET",
        data: "taskId=" + $taskId + "&labelId=" + $labelId + "&actionId=" + $labelStatus,
        success: function (response) { }
    });

    // �������
    //console.log("taskId: " + $taskId + ", LabelId: " + $labelId + ", status: " + $labelStatus); // �������
    return false;
});

// �������� ��������� ������������� ������
$('.dropdown-menu.users-menu.editer li').on('click', function (event) {

    // ������� �������
    var $current = $(event.currentTarget);
    // Checkbox
    var $checkbox = $current.find('input');

    // ����� �� ������
    $taskId = $current.parents('.task-box').attr('id');
    // ����� �� ������
    $userId = $checkbox.attr('data-target');
    // ����� ������
    $userStatus = !$checkbox[0].checked;
    // ������ �������� checkbox'�
    $checkbox[0].checked = $userStatus;
    
    // ���������� AJAX-������
    $.ajax({
        url: "/Home/EditTaskUser",
        type: "GET",
        data: "taskId=" + $taskId + "&userId=" + $userId + "&actionId=" + $userStatus,
        success: function (response) { }
    });
    
    // �������
    //console.log("taskId: " + $taskId + ", LabelId: " + $labelId + ", status: " + $labelStatus); // �������
    return false;
});

// ������������� ���� ��� ����� � �������� �����
$('.task-box').on('mouseover', function () {
    $(this).css('box-shadow', '0 0 10px black');
});

// ������� ���� ��� ����� �� �����
$('.task-box').on('mouseout', function () {
    $(this).css('box-shadow', '');
});

// �������� ��������� � ������ ������
$('.task-text.editer').on('blur', function (event) {
    // ����� ����� ������
    $text = $(event.currentTarget).val();
    // ����� ���������� ������������� ������
    $taskId = $(event.currentTarget).attr('name');

    // ���������� AJAX-������
    $.ajax({
        url: "/Home/EditTaskText",
        type: "GET",
        data: "taskId=" + $taskId + "&text=" + $text,
        success: function (response) { }
    })

    // �������
    console.log("tex: " + $text + ", taskId: " + $taskId);
    return false;
});

// �������� ��������� � ��������� ������
$('.task-title.editer input').on('blur', function (event) {
    // ����� ����� ��������� ������
    $text = $(event.currentTarget).val();
    // ����� ���������� ������������� ������
    $taskId = $(event.currentTarget).attr('name');

    // ���������� AJAX-������
    $.ajax({
        url: "/Home/EditTitleText",
        type: "GET",
        data: "taskId=" + $taskId + "&title=" + $text,
        success: function (response) { }
    })

    // �������
    //console.log("tex: " + $text + ", taskId: " + $taskId);
    return false;
});

// �������������� ����� ����� ������ (�������������)
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
    // ������ 
    var $LiList = $($element).find('.labels-menu li');
    // ������ � ������
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
