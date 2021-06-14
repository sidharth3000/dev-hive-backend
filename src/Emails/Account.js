const APIkey = "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";
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(APIkey);

const sendWelcomeEmail = (email, name) => {

    const welcome = {
        to: email,
        from: 'sidharthsaini49@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the DEV-hive, ${name}. Let me know how you get along with the app.`
    }

    sgMail.send(welcome).then(() => {
        console.log('Message sent')
    }).catch((error) => {
        console.log(error.response.body)
    })

}

const sendCancelationEmail = (email, name) => {

    const bye = {
        to: email,
        from: 'sidharthsaini49@gmail.com',
        subject: 'Sorry to see you go!',
        text: `Goodbye, ${name}. I hope to see you back sometime soon.`
    }

    sgMail.send(bye).then(() => {
        console.log('Message sent')
    }).catch((error) => {
        console.log(error.response.body)
    })
}



module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}




