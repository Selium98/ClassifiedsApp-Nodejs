const controller = require("./controller-admin")

module.exports = function(admin){
    admin.route("/").get(controller.login)

    admin.route("/login").get(controller.login)

    admin.route("/loginverify").post(controller.loginverify)

    admin.route("/viewads").get(controller.viewads)

    admin.route("/getmoreinfo/:id").get(controller.getmoreinfo)

    admin.route("/getmoreinfopost").post(controller.getmoreinfopost)

    admin.route("/viewmembers").get(controller.viewmembers)

    admin.route("/viewcompletedetails/:id").get(controller.viewcompletedetails)


    

}