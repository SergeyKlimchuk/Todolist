// ����� ���� ������� ���������� �������
function SetLabelsAddTask() {
    //console.log("��������!");
    // ������ � ������
    var $LabelsLine = $('.fromAdd').find('.task-tags-menu');
    // ������ 
    var $LiList = $('.fromAdd').find('.labels-menu li').not('.labelAddBtn');
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
    var $LiList = $('.fromAdd').find('.tool-user-changer li').not('.userAddBtn');
    // ������ ����� �� ���������� �����
    $UsersLine.empty();

    for (var item = 0; item < $LiList.length; item++) {
        var $checkBox = $($LiList[item]).find('input:checkbox')[0];
        var $userName = $($LiList[item]).find('label').text();
        console.log($($checkBox).checked);
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
    for (var d = 0; d < $users.length; d++) { $users[d].checked = false; }
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
        url: "/Home/AjaxDeleteTask",
        type: "POST",
        data: "taskId=" + $taskId
    })

    $segment.remove();
};
// ���������� ����� �����
function SetLabelsLineById(id) {
    var $element = $('.task-box#' + id);
    // ������ 
    var $LiList = $($element).find('.labels-menu li').not('.labelAddBtn');
    // ������ � ������
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
// ���������� ������ �������������
function SetUsersLineById(id) {
    var $element = $('.task-box#' + id);
    // ������ 
    var $LiList = $($element).find('.tool-user-changer li').not('.userAddBtn');
    //console.log($LiList);
    // ������ � ������
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
    $labelStatus = !($checkbox[0].checked);
    // ������ �������� checkbox'�
    $checkbox[0].checked = $labelStatus;

    // ���������� AJAX-������
    $.ajax({
        url: "/Home/AjaxSetTaskLabel",
        type: "POST",
        data: "taskId=" + $taskId + "&labelId=" + $labelId + "&isAddAction=" + $labelStatus,
        success: function (response) { }
    });

    // �������
    //console.log("taskId: " + $taskId + ", LabelId: " + $labelId + ", status: " + $labelStatus); // �������
    SetLabelsLineById($taskId);
    return false;
}
// �������������� �������������
function UserEdit(event) {
    console.log("���������� ����������");
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
        url: "/Home/AjaxSetTaskUser",
        type: "POST",
        data: "taskId=" + $taskId + "&userId=" + $userId + "&isAddAction=" + $userStatus,
        success: function (response) { }
    });

    // �������
    //console.log("taskId: " + $taskId + ", UserId: " + $userId + ", status: " + $userStatus); // �������
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
        url: "/Home/AjaxSetTaskText",
        type: "POST",
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
        url: "/Home/AjaxSetTaskTitle",
        type: "POST",
        data: "taskId=" + $taskId + "&text=" + $text,
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
$('.btn-exit.editer').on('click', DeleteTask);
// �������� ��������� � ������ ������
$('.task-text.editer').on('blur', TaskTextEdit);
// �������� ��������� � ������ ������
$('.labels-menu.editer li').on('click', LabelEdit);
// �������� ��������� ������������� ������
$('.users-menu.editer li').on('click', UserEdit);


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
    // ���������� AJAX-������
    $.ajax({
        url: "/Home/AjaxAddTask",
        type: "POST",
        data: { Text: $text, Title: $title, Labels: labelsList, Users: usersList },
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
    
    // ������� �������
    var $task = $('.task-box#' + taskId);
    // ��������� ����������� ��������
    $task.find('.btn-exit.editer').on('click', DeleteTask);
    // ��������� ����������� �������������� �������
    $task.find('.dropdown-menu.labels-menu.editer li').not('.labelAddBtn').on('click', LabelEdit);
    // ��������� ����������� �������������� �������������
    $task.find('.dropdown-menu.users-menu.editer li').not('.userAddBtn').on('click', UserEdit);
    // ��������� ����������� �������� ���������
    $task.find('.task-title.editer input').on('blur', TaskTitleEdit);
    // ��������� ����������� �������� �����
    $task.find('.task-text.editer').on('blur', TaskTextEdit);

    // ����� �����
    SetLines(taskId);

    // ������� ����� ����������
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
}

function AddNewLabelToList(response) {
    color = $('#label-add-color-change label.active').text();
    text = $('#label-add-name-change').val();
    labelId = response;

    resultColor = "";
    switch (color) {
        case "�������":
            resultColor = "#f33"
            break;
        case "������":
            resultColor = "#f3f"
            break;
        case "�����":
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

    // �������
    $('#label-add-color-change label.active checkbox').checked = false;
    $('#label-add-color-change label.active').removeClass('active');

    $('#label-add-color-change label').first().checked = true;
    $('#label-add-color-change label').first().addClass('active');

    text = $('#label-add-name-change').val('');

    return null;
}

// ������� ����������� �����
$('.task-delete').not('.editer').on('click', ClearAddFrom);
// ����� ������� ������� �������
$('.task-tools-menu').not('.editer').find('li').on('click', SetLabelsAddTask);
// ����� ������������� ������� �������
$('.tool-user-changer').not('.editer').find('li').not('.userAddBtn').on('click', SetUsersAddTask);

$('#label-add-accept').on('click', function (event) {
    var $object = $(event.currentTarget).parents('.labelAddForm');
    var $LabelsList = $($object).find('#label-add-color-change').first();
    var $chackedLabel = $($LabelsList).find('input:checked').parent('label');
    
    // ����� ������ ������
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
    //console.log("start search with: text='" + text + "'");
    
    $.ajax({
        url: "/Home/SearchUserByNameOrEmail",
        type: "POST",
        data: "pattern="+text,
        success: function (result) {
            //console.log($(result));
            var $resultSegment = $($input).parent().siblings('#users-result-list');
            $resultSegment.empty();
            $resultSegment.append($('<hr />'));
            $resultSegment.append($('<h4 class="text-center"><b>resultat:</b></h4>'));

            $resultSegment.append($(result));

            // ������� �� ������ ������� ���� �������� �� �������
            $('#users-result-list button').on('click', function (event) {
                var $element = $(event.currentTarget);
                $element.siblings('button').removeClass('active');
                $element.toggleClass('active');

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