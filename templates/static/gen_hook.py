
fp_hook = open('hook.js','w')
fp_hook.truncate()
for file_name in ['request.js','webrtc.js','pybeef.js','browser_me.js']:
	with open(file_name) as f:
		f_js = f.read()
	fp_hook.write(f_js)

