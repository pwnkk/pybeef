import pymongo
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")

db = client.hookbrowser

# db feels like database  and there is a db.info  seems like table name  
'''
widgets=db.widgets
widgets.insert({"foo": "bar","foo2":"bar2","quantity":"4"})
print db.collection_names()

doc=widgets.find_one({"foo":"bar"})
doc["quantity"]=100

widgets.save(doc)
print widgets.find_one({"foo":"bar"})

db.words.insert({"word":"oarlock","definition":"A device attached to a rowboat to hold the oars in place"})
db.words.insert({"word":"seminomadic","definition":"Only partially nomadic"})
db.words.insert({"word":"pertub","definition":"Bother, unsettle, modify"})



db.info.insert({"hook_id":"123"})
db.info.insert({"hook_id":"456"})
db.info.insert({"hook_id":"789"})


res=''
for doc in db.info.find():
	res+=str(doc)
print res
f=open("tree.json","w")
f.write(res)
f.close()

"1":{"hook_id":"zxczxczxczxc","ua":"IE","host":"127.0.0.1"},
'''


#db.info.insert({"hook_id":"789"})
'''
db.info.insert({"_id":"beef",
	"hook_browser":{"online":{},
					"offline":{"0":{"hook_id":"asdasdasdas","ua":"Firefox","host":"127.0.0.1"},
							  },
				   },
	})
'''
'''
db.info.update(
	{"_id":"beef"},
	{"$set":
		{
			"hook_browser.offline.0.hook_id":"insertID",
			"hook_browser.offline.0.ua":"Mozilla Firefox",
		}

	},
	{upsert:True}
	)


db.info.insert({
    "ua":"test_ua_insert","host":"1.1.1.1","hook_id":"SJAKDJFHWEYWUYERUIQWHE"})
'''
db.info.remove()
#doc = db.info.find_one({"hook_id":"HAM77d3kH1ewgVlSFCkg7H06OV0l642f"})
#doc["log"]=doc["log"]+"qwe"
#db.info.save(doc)

for doc in db.info.find():
	print doc


