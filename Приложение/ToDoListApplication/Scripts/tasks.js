var options = [];

$('.dropdown-menu a').on('click', function (event) {

    var $target = $(event.currentTarget), // текущий объект
        val = $target.attr('data-value'), // индекс строчки
        $inp = $target.find('input'),     // ищет input
        idx;
    
    var $labelValue = false;

    var $status = !($inp.attr('checked') == null);
    //console.log($status);
    /*

    if ((idx = options.indexOf(val)) > -1) {
        options.splice(idx, 1);
        setTimeout(function () { $inp.prop('checked', false) }, 0);
        $labelValue = false;
    } else {
        options.push(val);
        setTimeout(function () { $inp.prop('checked', true) }, 0);
        $labelValue = true;
    }
    
    $(event.target).blur();

    var $taskId = $inp.attr('name');
    var $labelId = val;

    //console.log($taskId);
    //console.log($labelId);
    //console.log($labelValue);

    /*$.ajax({
        url: "/Home/EditLabel",
        type: "GET",
        data: "taskId=" + $taskId + "&labelId=" + $labelId + "&actionId=" + $labelValue,
        success: function (response) {
            $('#superID').text(response);
        }
    })*/
    
    console.log(options);
    return false;
});



/*

---LAST---


var options = [];

$('.dropdown-menu a').on('click', function (event) {

    var $target = $(event.currentTarget), // текущий объект
        val = $target.attr('data-value'), // индекс строчки
        $inp = $target.find('input'),     // ищет input
        idx;
    
    var $labelValue = false;

    var $status = !($inp.attr('checked') == null);
    console.log("status: " + $status);

    $inp.val('value', null);
    //$inp.prop('checked', !$status);
    
    $(event.target).blur();

    var $taskId = $inp.attr('name');
    var $labelId = val;

    console.log($taskId);
    console.log($labelId);
    console.log($status);

    /*$.ajax({
        url: "/Home/EditLabel",
        type: "GET",
        data: "taskId=" + $taskId + "&labelId=" + $labelId + "&actionId=" + $labelValue,
        success: function (response) {
            $('#superID').text(response);
        }
    })
    
    console.log(options);
    return false;
});
*/