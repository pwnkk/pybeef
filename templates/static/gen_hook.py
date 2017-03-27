import socket 
def config_ip():
    ip = socket.gethostbyname(socket.gethostname())   
    fp_request = open('request.js','r')
    lines = fp_request.readlines()
    fp_request.close()
    
    fp = open('request.js','w')
    for line in lines:
        new_req = line.replace("{IPaddress}",ip)
        fp.write(new_req)
    fp.close()

fp_hook = open('hook.js','w')
fp_hook.truncate()
for file_name in ['request.js','webrtc.js','pybeef.js','browser_me.js']:
	with open(file_name) as f:
		f_js = f.read()
	fp_hook.write(f_js)

