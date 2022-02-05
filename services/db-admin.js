const mongodb = require('mongodb')
const mongoClient = require('mongodb').MongoClient
var url = "mongodb://localhost:27017"
var db;

function adminMember(email, password){
    var collection = db.collection("admin")
    var filter = {
        "email" : email,
        "password" : password
    }
    var userData = collection.findOne(filter)
    return userData;
}

var dbController = {
    connection : function(){
        mongoClient.connect(url, function(err, database){
            if(err)
            {
                console.log("Err in database server connection")
                return
            }
            db = database.db("ClassifiedsApp")
            console.log("DB Connected from Admin")
        })
    },

    viewAds : function(res){
        var collection = db.collection("ads")
        collection.find().sort({createdDateTime: -1 }).toArray(function(err,result){
            if(err){
                console.log("Err in view")
                return
            }
            res.render("admin-viewads", {title: "view page", adata : result})
        })
    },

    getMoreInfo : function(id,res){
        var collection = db.collection("member")
         
        var newId = id
        var filter = {
            "_id" : mongodb.ObjectId(newId)
            
        }
        var frdata = null
          
        collection.find(filter).toArray(function(err,result){
            if(err){
                console.log("Err in updating")
                return
            }
            result.forEach(element => {
                frdata = element
            })
            console.log(frdata)
            res.render("admin-getmoreinfo" , {data:frdata})
        })
    },

    viewMembers : function(res,req){
        var collection = db.collection("member")
        collection.find().sort({age: -1 }).toArray(function(err,result){
            if(err){
                console.log("Err in view")
                return
            }
            res.render("admin-viewmembers", {title: "view page", data : result})
        })
    },
   
    viewMembersDetails : function(id,res){
        var memberCollection = db.collection("member")
        var adCollection = db.collection("ads")
        var filter = {
            _id: mongodb.ObjectId(id)
        }
        var filter2 = {
            userid: id //..f22a
        }
        memberCollection.find(filter).toArray(function (err, result1) {
            if (err) {
                console.log("Error")
                return
            }
            adCollection.find(filter2).toArray(function (err, result2) {
                if (err) {
                    console.log("Error")
                    return
                }
                res.render("admin-viewmembersdetails", { title: "Full Member Details", memberData: result1, adData: result2 })
            })
        })
    },

    contactMemberGuest: function (id, res) {

        var membercollection = db.collection("member")
        var newId = mongodb.ObjectId(id)
        var filter = {
            "_id": newId
        }

        membercollection.find(filter).toArray(function (err, result) {
            if (err) {
                console.log("err")
                return
            }
            result.forEach(element => {
                memberData = element
            })
            res.render("guest-contactinfo", { title: "view", 'memberData': memberData })
        })
    },
}

module.exports = {dbController,adminMember}