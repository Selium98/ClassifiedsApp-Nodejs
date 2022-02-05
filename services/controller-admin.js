const dbController = require("./db-admin")
const emailController = require("./mail-service")

dbController.dbController.connection()

var admuser
 //get the admin mail
var mememail = "" //get the member email
var memname = "" //get the member name

var admincontroller = {
    login: function (req, res) {
        res.render("admin-login", { title: "Admin Login Page" })
    },

    loginverify : async function(req,res){
        var email = req.body.email
        var password = req.body.password
        console.log("Email : ", email)
        console.log("Password : ", password)

        var data = await dbController.adminMember(email, password)
        var admuser = data
        
        if (data != null)
        {   
            res.render("admin-viewads", {title : "Admin Home Page", adata : data})
        }
        else
        {
            res.render("admin-login", {title : "Admin Login Page"})
        }
    },

    viewads : function(req,res){
        dbController.dbController.viewAds(res)
    },
    

    getmoreinfo : function(req,res){
        var id = req.params.id
        console.log(id)
        dbController.dbController.getMoreInfo(id,res)
    },

    getmoreinfopost : function(req,res){
        var memname = req.body.fname
        var description = req.body.description
        var mememail = req.body.email
        mailBody = "Hi " +memname+ ",<br> The admin has requested more information about the ad you have created. Kindly login and check the updates!.<br> The Message is : <b> "+description+"</b>"            
        emailController.send(mememail, "yashkulkarni0804@gmail.com", "Action Required for Ad - Admin", mailBody)
        res.redirect("/admin/viewads")
    },

    viewmembers : function(req,res){
        dbController.dbController.viewMembers(res)
    },

    viewcompletedetails : function(req,res){
        var id = req.params.id
        console.log(id)
        dbController.dbController.viewMembersDetails(id,res)
    },
}

module.exports = admincontroller