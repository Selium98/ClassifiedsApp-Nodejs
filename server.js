const express = require('express')
const session = require('express-session')
const formidable = require('formidable')
const fs = require('fs')
var path = require('path');
var app = express()
var port = 7600
var bodyParser = require('body-parser')

//creating sub server
var member = express() 
var admin = express()

//mount body parser
app.use(bodyParser.urlencoded({
    extended:true
    }))

//mount ejs
app.set("view engine", "ejs")
member.set("view engine", "ejs")
admin.set("view engine", "ejs")
app.use(express.static('public'));

//create sessions
member.use(session({
    secret: "member",
    resave: true,
    saveUninitialized: true
}))

 admin.use(session({
    secret: "member",
    resave: true,
    saveUninitialized: true
}))

//mount the sub server on to main server app
app.use("/member", member)
app.use("/admin", admin)

//routes mapping
var adminroute = require("./services/routes-admin")
var memberroute = require("./services/routes-member")

adminroute(admin)
memberroute(member)

app.listen(port, function(err,res){
    if (err){
        console.log("Err in starting")
    }
    console.log("Server started at : ",port)
})