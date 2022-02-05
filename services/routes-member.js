const controller = require("./controller-member")

module.exports = function(member){

    member.route("/").get(controller.login)

    member.route("/login").get(controller.login)

    member.route("/loginverify").post(controller.loginverify)

    member.route("/member-register").get(controller.register)

    member.route("/reuploadImg/:id").get(controller.reuploadImgView)

    member.route("/reuploadImg").post(controller.reuploadImg)

    member.route("/registerpost").post(controller.registerpost)

    member.route("/viewads").get(controller.viewads)

    member.route('/createads').get(controller.createads)

    member.route('/createadspost').post(controller.createadspost)
    
    member.route('/member-forgotpassword').get(controller.forgotpassword)

    member.route('/sendpassword').post(controller.sendpassword)

    member.route('/updateaddinfo/:id').get(controller.updateaddinfo)

    member.route("/updateaddinfopost").post(controller.updateaddinfopost)

    member.route("/deleteaddinfo/:id").get(controller.deleteaddinfo)

    member.route('/updatepassword').get(controller.updatepassword)

    member.route('/updatepasswordpost').post(controller.updatepasswordpost)

    member.route('/updatememberinfo').get(controller.updatememberinfo)

    member.route('/updatememberinfopost').post(controller.updatememberinfopost)

    member.route('/deleteads').get(controller.deleteads)

    member.route('/deleteadspost').post(controller.deleteadspost)

    member.route('/deleteaccount').get(controller.deleteaccount)

    member.route('/deleteaccountpost').post(controller.deleteaccountpost)

    member.route('/guesthome').get(controller.guesthome)

    member.route('/guestlogin').post(controller.guestlogin)

    member.route('/guest-getmoreinfo/:id').get(controller.guestgetmoreinfo)

    member.route('/guest-contactinfo/:id').get(controller.guestcontactinfo)

    member.route('/contactinfopost').post(controller.guestcontactinfopost)

    member.route('/logout').get(controller.logout)

}