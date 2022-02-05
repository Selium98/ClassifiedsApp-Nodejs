const mongodb = require('mongodb')
const mongoClient = require('mongodb').MongoClient
var url = "mongodb://localhost:27017"
const fs = require('fs')
var db;

function loginMember(email, password){
    var collection = db.collection("member")
    var filter = {
        "email" : email,
        "password" : password
    }
    var userData = collection.findOne(filter)
    return userData;
}

function reuploadImgAd(req, form, currloginUser) {
    //getting collection
    dbController.connection()    
    form.parse(req, function (err, fields, files) {
        //collecting information about the file upload
        var collection = db.collection("ads")
        var selectedId = fields.id
        var filter = {
            "_id": mongodb.ObjectId(selectedId)
        }
        console.log("id to filter "+selectedId)
        var oldPath = files.filetoupload.filepath; //temp location 
        var extension = files.filetoupload.originalFilename.split('.').pop()
        console.log(extension)
        var adData = {
            $set: {
                'image': extension
            }
        }
        collection.updateMany(filter, adData, function (err, result) {
            if (err) {
                console.log("err in update")
                return
            }
        })
        var adId = fields.id
        var newFileNameName = "./public/media/" + adId + "." + extension;
        fs.readFile(oldPath, function (err, data) {
            if (err) {
                console.log("Error in upload : ", err)
                return
            }
            //write
            fs.writeFile(newFileNameName, data, function (err) {
                if (err) {
                    console.log("Error in upload : ", err)
                    return
                }
            })
        })

    })
}

function createAdd(req, form, cid){
    var collection = db.collection("ads")
    form.parse(req, function(err, fields, files){
        var oldPath = files.adimage.filepath; //temp location 
        var extension = files.adimage.originalFilename.split('.').pop();
        var name = fields.name
        var description = fields.description
        var price = fields.price 
        var createdDateTime = Date.now();
        var adData = {
            'name' : name,
            'description' : description,
            'price' : price,
            'userid' : cid,
            'image' : extension,
            'createdDateTime' : createdDateTime,
        }
        collection.insertOne(adData, function(err,result){
            if(err){
                console.log("Err in adding")
                return
            }
            console.log("Ad created")
            var adId = adData._id 
            var newFileNameName = "./public/media/" + adId + "." + extension;
            fs.readFile(oldPath, function(err, data){
                if(err)
                {
                    console.log("Error in upload : ", err)
                    return
                }
                //write
                fs.writeFile(newFileNameName, data, function(err){
                    if(err)
                    {
                        console.log("Error in upload2 : ", err)
                        return   
                    }
                })
            })
        })
    })
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
            console.log("DB Connected from Member and Guest")
        })
    },

    registerMember : function(data){
        var collection = db.collection("member")
        collection.insertOne(data, function(err,result){
            if(err){
                console.log("Err in adding")
                return
            }
            console.log("Member Registered!")
        })
    },

    getUserByEmail : function(email){
        var collection = db.collection("member")
        var filter = {
            "email" : email
        }
        var userData = collection.findOne(filter)
        return userData
    },

    updateInfo: function(id,res){
        var collection = db.collection("ads")
         
        var newId = mongodb.ObjectId(id)
        var filter = {
            "_id" : newId
        }
        var stdata = null
          
        collection.find(filter).toArray(function(err,result){
            if(err){
                console.log("Err in updating")
                return
            }
            result.forEach(element => {
                stdata = element
            })
           res.render("member-updateinfo" , {data:stdata})
        })
    },

    updateInfoPost : function(req,res){
        var id = req.body.id
        var name = req.body.name
        var description = req.body.description
        var price = req.body.price

        var frtdata = {
            $set :  {
                "id":id,
                "name" : name,
                "description" : description,
                "price" : price,
            }
        }
       
        var whereclause = {
            "_id" : mongodb.ObjectId(id)
        }
        var collection = db.collection("ads")
    
        collection.updateMany(whereclause, frtdata, function(err, data){
            if(err)
            {
                console.log("Err in update : ", err)
                return
            }    
        })
    },

    viewallads: function (res, id) {
        var collection = db.collection("ads")
        var filter = {
            "userid": id
        }
        collection.find(filter).sort({ createdDateTime: -1 }).toArray(function (err, result) {
            if (err) {
                console.log("Error")
                return
            }
            res.render("member-viewads", { title: "List Of Ads", adata: result, isMember: true })
        })
    },

    deleteInfo : function(id,res){
        var collection = db.collection("ads")
        var filter = {
            "_id" : mongodb.ObjectId(id)
        }
        collection.deleteOne(filter,function(err,data){
            if(err){
                console.log("Err while deleting")
            }
            console.log("Ad deleted")
            res.render("member-viewads", {title: "view page", data : data})
        }) 
    },
    
    updatePassword: function(id,res,req){
        var collection = db.collection("member")
        var password = req.body.password

        var passdata = {
            $set :  {
                "password":password
            }
        }
        var whereclause = {
            "_id" : mongodb.ObjectId(id)
        }
        collection.updateMany(whereclause,passdata, function(err, data){
            if(err)
            {
                console.log("Err in update : ", err)
                return
            }  
        })
    },
     
    updateMemInfo: function(id,res){
        var collection = db.collection("member")
         
        var newId = mongodb.ObjectId(id)
        var filter = {
            "_id" : newId
        }
        var stdata = null
          
        collection.find(filter).toArray(function(err,result){
            if(err){
                console.log("Err in updating")
                return
            }
            result.forEach(element => {
                stdata = element
            })
           res.render("member-updatememinfo" , {data:stdata})
        })
    },

    deleteAd: function (res, id) {
        var newId = mongodb.ObjectId(id)
        var adcollection = db.collection("ads")
        var filter = {
            "_id": newId
        }
        adcollection.deleteOne(filter, function (err, result) {
            if (err) {
                console.log("Err in delete ", err)
                return
            }
            console.log("ad deleted")
        })      
    },

    reuploadImgView: function (id, res) {
        var collection = db.collection("ads")
        var newId = mongodb.ObjectId(id)
        var filter = {
            "_id": newId
        }
        var adData = null;
        collection.find(filter).toArray(function (err, result) {
            if (err) {
                console.log("err")
                return
            }
            result.forEach(element => {
                adData = element
            })
            res.render("member-updateimg", { title: "view", data: adData })
        })
    },

    updateMemInfoPost : function(id,res,req){
        var collection = db.collection("member")
        var id = req.body.id
        var email = req.body.email
        var uname = req.body.uname
        var fname = req.body.fname
        var lname = req.body.lname
        var stream = req.body.stream
        var age = req.body.age
        var dob = req.body.dob

        var passdata = {
            $set :  {
                "id":id,
                "email":email,
                "uname":uname,
                "fname":fname,
                "lname":lname,
                "stream":stream,
                "age":age,
                "dob":dob,
            }
        }
        var whereclause = {
            "_id" : mongodb.ObjectId(id)
        }
        collection.updateMany(whereclause,passdata, function(err, data){
            if(err)
            {
                console.log("Err in update : ", err)
                return
            }  
        })
    },

    deleteAllAds: function(id,req,res){
        var collection = db.collection("ads")
        var newId =id
        var filter = {
            "userid" : newId
        }
        collection.deleteMany(filter,function(err,data){
            if(err){
                console.log("Err while deleting")
            }
            console.log(filter)
            console.log("All ads deleted")  
        }) 
    },

    deleteAccount : function(id,req,res){
        var collection = db.collection("member")
        var newId = mongodb.ObjectId(id)
        var filter = {
            "_id" : newId
        }
        collection.deleteMany(filter,function(err,data){
            if(err){
                console.log("Err while deleting")
            }
            console.log(filter)
            console.log("Account Deleted")  
        }) 
    },

    viewAdsGuests : function(res){
        var collection = db.collection("ads")
        collection.find().sort({createdDateTime: -1 }).toArray(function(err,result){
            if(err){
                console.log("Err in view")
                return
            }
            res.render("guest-viewads", {title: "view page", data : result})
        })
    },

    viewMoreInfo: function (id, res) {
        var collection = db.collection("ads")
        var membercollection = db.collection("member")
        var newId = mongodb.ObjectId(id)
        var filter = {
            "_id": newId
        }
        var adData = null;
        collection.find(filter).toArray(function (err, result) {
            if (err) {
                console.log("err")
                return
            }
            result.forEach(element => {
                adData = element
            })
            var memberid = adData.userid
            console.log(memberid)
            var filter2 = {
                "_id": mongodb.ObjectId(memberid)
            }
            membercollection.find(filter2).toArray(function (err, result) {
                if (err) {
                    console.log("err")
                    return
                }
                result.forEach(element => {
                    memberData = element
                })
                res.render("guest-getmoreinfo", { title: "view", 'adData': adData, 'memberData': memberData })
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

module.exports = {dbController,loginMember,createAdd,reuploadImgAd}