const sgMail = require('@sendgrid/mail')
sgMail.setApiKey("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")

var sendMail = {
    send : function(toEmail, fromEmail, ccEmail,subject, html){
        //data verification
        //mandatory data
        if( toEmail == null )
        {
            return null;
        }

        const msg = {
            to: toEmail,
            from: fromEmail,
            cc:ccEmail,
            subject: subject,
            html: html
          }

          sgMail
            .send(msg)
            .then(() => {
            console.log('Email sent')
            })
            .catch((error) => {
            console.error(error)
            })
    }
}

module.exports = sendMail