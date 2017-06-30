
// ����� ���� ������� ���������� �������
function SetLabelsAddTask() {
    // ������ � ������
    var $LabelsLine = $('.fromAdd').find('.task-tags-menu');
    // ������ 
    var $LiList = $('.fromAdd').find('.labels-menu li');
    // ������ ����� �� ���������� �����
    $LabelsLine.empty();

    for (var item = 0; item < $LiList.length; item++) {
        var $checkBox = $($LiList[item]).find('input:checkbox')[0];
        var $labelText = $($LiList[item]).find('label').text();

        if ($checkBox.checked) {
            $($LabelsLine).append($("<span class='label-segment pull-right'>" + $labelText + "</span>"));
        }
    }
}
// ����� ���� �������������
function SetUsersAddTask() {
    // ������ � ������
    var $UsersLine = $('.fromAdd').find('.task-users-menu');
    // ������ 
    var $LiList = $('.fromAdd').find('.tool-user-changer li');
    // ������ ����� �� ���������� �����
    $UsersLine.empty();

    for (var item = 0; item < $LiList.length; item++) {
        var $checkBox = $($LiList[item]).find('input:checkbox')[0];
        var $userName = $($LiList[item]).find('label').text();

        if ($checkBox.checked) {
            $($UsersLine).append($("<span class='label-segment pull-right'>" + $userName + "</span>"));
        }
    }
}
// ������� ����� ����������
function ClearAddFrom() {
    $title = $("input[name='TaskTitle']")[0];
    $text = $("textarea[name='TaskText']")[0];
    $labels = $("ul[name='LabelsList'] input[type='checkbox']");
    $users = $("ul[name='UsersList'] input[type='checkbox']");

    // �������
    $($title).val("");
    $($text).val("");
    for (var i = 0; i < $labels.length; i++) { $labels[i].checked = false; }
    for (var i = 0; i < $users.length; i++) { $users[i].checked = false; }
    // ������� ����� �������
    $('.fromAdd').find('.task-tags-menu').empty();
    // ������� ����� �������������
    $('.fromAdd').find('.task-users-menu').empty();
}

// �������� �������
function DeleteTask(event) {
    var confirmation = confirm('Ahtung! You are trying delete this record, you know what are you doing?');

    if (!confirmation) {
        return false;
    }

    var $taskId = $(event.currentTarget).attr('data-target');
    var $segment = $(event.currentTarget).parents('.task-box');

    // ���������� AJAX-������
    $.ajax({
        url: "/Home/DeleteTask",
        type: "GET",
        data: "taskId=" + $taskId
    })

    $segment.remove();
};
// ���������� ����� �����
function SetLabelsLineById(id) {
    var $element = $('.task-box#' + id);
    // ������ 
    var $LiList = $($element).find('.labels-menu li');
    // ������ � ������
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
// ���������� ������ �������������
function SetUsersLineById(id) {
    var $element = $('.task-box#' + id);
    // ������ 
    var $LiList = $($element).find('.tool-user-changer li');
    // ������ � ������
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
// ���������� ���� �����
function SetLines(id) {
    SetLabelsLineById(id);
    SetUsersLineById(id);
}
// �������������� �������
function LabelEdit(event) {

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
    SetLabelsLineById($taskId);
    return false;
}
// �������������� �������������
function UserEdit(event) {

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
    SetUsersLineById($taskId);
    return false;
}
// ��������� ������ �������
function TaskTextEdit(event) {
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
    //console.log("tex: " + $text + ", taskId: " + $taskId);
    return false;
}
// ��������� ��������� �������
function TaskTitleEdit(event) {
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
}

// ����������� ����
function ShowShadow() {
    $(this).css('box-shadow', '0 0 10px black');
}
// ������� ����
function HideShadow() {
    $(this).css('box-shadow', '');
}
// ������ ��������� ������� ���������� ����
function TextAreaResize() {
    var el = this;
    setTimeout(function () {
        el.style.cssText = 'height:auto; padding:0';
        // for box-sizing other than "content-box" use:
        // el.style.cssText = '-moz-box-sizing:content-box';
        el.style.cssText = 'height:' + el.scrollHeight + 'px';
    }, 0);
}

// �������� ��������� � ��������� ������
$('.task-title.editer input').on('blur', TaskTitleEdit);
// �������� ������
$('.task-delete.editer span').on('click', DeleteTask);
// �������� ��������� � ������ ������
$('.task-text.editer').on('blur', TaskTextEdit);
// �������� ��������� � ������ ������
$('.dropdown-menu.labels-menu.editer li').on('click', LabelEdit);
// �������� ��������� ������������� ������
$('.dropdown-menu.users-menu.editer li').on('click', UserEdit);


// ������������� ���� ��� ����� � �������� �����
$('.task-box').on('mouseover', ShowShadow);
// ������� ���� ��� ����� �� �����
$('.task-box').on('mouseout', HideShadow);
// �������������� ����� ����� ������ (�������������)
$('textarea').on('keydown', TextAreaResize);


// ���������� ���������� ����� ��� ���� �������
$(function () {
    $tasks = $('.task-box');
    if ($tasks.length > 1) {
        for (var item = 1; item < $tasks.length; item++) {
            var id = $($tasks[item]).attr('id');
            SetLines(id);
        }
    }
});
// ���������� �������
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
    
    // ���������� AJAX-������
    $.ajax({
        url: "/Home/AddTaskAndGetView",
        type: "POST",
        data: { Text: $text, Title: $title, LabelModel: labelsList, Friend: usersList },
        success: AddNewTask
    })
    
});
// ���������� ������� �� ������������� ������
function AddNewTask(response) {
    // ����������� ��������� �������� (�������)
    //console.log(response);

    // ������������� �������
    taskId = $(response).find('.task-box').attr('id');

    // ���������� �������� �� ���������
    $(response).insertAfter('.fromAdd');

    // ����� �����
    SetLines(taskId);

    // ������� �������
    var $task = $('.task-box#' + taskId);
    // ��������� ����������� ��������
    $task.find('.task-delete.editer span').on('click', DeleteTask);
    // ��������� ����������� �������������� �������
    $task.find('.dropdown-menu.labels-menu.editer li').on('click', LabelEdit);
    // ��������� ����������� �������������� �������������
    $task.find('.dropdown-menu.users-menu.editer li').on('click', UserEdit);
    // ��������� ����������� �������� ���������
    $task.find('.task-title.editer input').on('blur', TaskTitleEdit);
    // ��������� ����������� �������� �����
    $task.find('.task-text.editer').on('blur', TaskTextEdit);

    // ������� ����� ����������
    ClearAddFrom();
}


// ������� ����������� �����
$('.task-delete').not('.editer').on('click', ClearAddFrom);
// ����� ������� ������� �������
$('.task-tools-menu').not('.editer').find('li').on('click', SetLabelsAddTask);
// ����� ������������� ������� �������
$('.tool-user-changer').not('.editer').find('li').on('click', SetUsersAddTask);
