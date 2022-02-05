const dbController = require("./db-member")
const emailController = require("./mail-service")
const guestemailController = require("./mail-service-guest")
const formidable = require('formidable')
const fs = require('fs')
var path = require('path');

var adminmail = "" //get the admin mail
var mememail = "" //get the member email
var memname = "" //get the member name

dbController.dbController.connection()
var currlogin
var currloginUser

var membercontroller ={

    login: function (req, res) {
        res.render("member-login", { title: "Staff Login Page" })
    },

    loginverify : async function(req,res){
        var email = req.body.email
        var password = req.body.password
        console.log("Email : ", email)
        console.log("Password : ", password)

        var data = await dbController.loginMember(email, password)
        currlogin = data
        currloginUser = data._id.toString()
        if (data != null)
        {   
            res.render("member-viewads", {title : "Member Home Page", adata : data,imageUrl : null})
        }
        else
        {
            res.render("member-login", {title : "Member Login Page"})
        }
    },

    register : function(req,res){
        res.render("member-register",{title : "Member Register Page"})
    },

    registerpost : function(req,res){
        var memberdata = {
            uname : req.body.uname,
            fname : req.body.fname,
            lname : req.body.lname,
            stream : req.body.stream,
            email : req.body.email,
            age : req.body.age,
            dob : req.body.dob,
            password : req.body.password
        }
        dbController.dbController.registerMember(memberdata)
        console.log("Member details Added")
        res.render("member-login", {title : "Member Login Page"})
    },

    viewads : async function(req,res){
        var id = currloginUser
        await dbController.dbController.viewallads(res, id)
    },

    createads : function(req,res){
        res.render('member-createad')
    },

    createadspost : async function(req,res){
        var cid = currloginUser
        var form = new formidable.IncomingForm();
        dbController.createAdd(req,form,cid)
        console.log("Ad details Added")
        res.redirect("/member/viewads")
    },
    
    reuploadImgView:function(req,res){
        var id = req.params.id 
        dbController.dbController.reuploadImgView(id,res)        
    },

    reuploadImg : async function (req,res) {
        var form = new formidable.IncomingForm()
        await dbController.reuploadImgAd(req,form,currloginUser)
        res.redirect("/member/viewads") 
    },


    forgotpassword : function(req, res){
        res.render("member-forgotpassword", {title : "Member Forgot Password Page"})
    },

    sendpassword : async function(req, res){
        var email = req.body.email
        var user = await dbController.dbController.getUserByEmail(email)
        if( user == null )
        {
            res.send("Invalid email address")
        }
        else{
            var password = user.password
            //send this email
            emailController.send(email, "yashkulkarni0804@gmail.com", "Password Recovery", "Dear Member, your password is  " + "<b>" + "Member Password:" + password + "</b>")
            res.render("member-login", {title : "Member Login Page"})
        }
    },

    updateaddinfo : function(req,res){
        var id = req.params.id
        dbController.dbController.updateInfo(id,res)
    },

    
    updateaddinfopost : function(req,res){
        dbController.dbController.updateInfoPost(req,res)
        console.log("Data Updated")
        res.redirect("/member/viewads")
    },

    deleteaddinfo :function(req,res,id){
        var id = req.params.id
        dbController.dbController.deleteInfo(id,res)
        res.redirect("/member/viewads")
    },

    updatepassword : function(req,res){
        res.render('member-updatepassword')
    },

    updatepasswordpost : function(req,res){
        var id = currloginUser
        var email = currlogin.email
        emailController.send(email, "yashkulkarni0804@gmail.com", "Password Update", "Dear Member, your password is has been updated")
        dbController.dbController.updatePassword(id,res,req)
        console.log("Password Updated")
        res.redirect("/member/viewads")
    },

    updatememberinfo : function(req,res){
        var id = currloginUser
        dbController.dbController.updateMemInfo(id,res)
    },

    updatememberinfopost : function(req,res){
        var id = currloginUser
        var email = currlogin.email
        emailController.send(email, "yashkulkarni0804@gmail.com", "Profile Update", "Dear Member, your profile is has been updated")
        dbController.dbController.updateMemInfoPost(id,res,req)
        console.log("Profile Updated")
        res.redirect("/member/viewads")
    },

    deleteads : function(req,res){
        res.render("member-deleteads")
    },

    deleteadspost : function(req,res){
        var id = currloginUser
        var email = currlogin.email   
        console.log(id)
        console.log(email)
        dbController.dbController.deleteAllAds(id,res)
        emailController.send(email, "yashkulkarni0804@gmail.com", "Ads Update", "Dear Member, all your ads have been deleted")
        res.render("member-login", {title : "Member Login Page"})
    },

    deleteaccount : function(req,res){
        res.render("member-deleteaccount")
    },
    
    deleteaccountpost : function(req,res){
        var id = currloginUser
        var email = currlogin.email   
        console.log(id)
        console.log(email)
        dbController.dbController.deleteAccount(id,res)
        emailController.send(email, "yashkulkarni0804@gmail.com", "Account Update", "Dear Member, ayour account has been deleted")
        res.redirect("/member/login")
    },

    guesthome : function(req,res){
        res.render("guest-home")
    },

    guestlogin : function(req,res){
        dbController.dbController.viewAdsGuests(res)
    },

    guestgetmoreinfo : function(req,res){
        var id = req.params.id
        dbController.dbController.viewMoreInfo(id,res)
    },

    guestcontactinfo : function(req,res){
        var id = req.params.id
        dbController.dbController.contactMemberGuest(id, res)
    },

    guestcontactinfopost : function(req,res){
        var memname = req.body.name
        var mememail = req.body.email
        var description = req.body.description
        var ccmail = "admin@gmail.com"
        mailBody = "Hi " + memname + ", " + "<br><p> A guest user has sent you a message !</p><p>Message:<b>" + description + "</b</p>"
        guestemailController.send(mememail, "yashkulkarni0804@gmail.com",ccmail, "Guest Ad Enquiry", mailBody)
        res.render("guest-home", { title: "Guest Home Page" })
    },

    logout: function (req, res) {
        req.session.destroy(function (err) {
            console.log("session destroyed")
        })
        res.render("member-login", { title: "Member Login Page" })
    },

    ////////////////////////////////////

    
    
}


module.exports = membercontroller
