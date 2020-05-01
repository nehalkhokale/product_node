const nodemailer = require('nodemailer')

module.exports.mail = (options, settings, cb) => {
    // create reusable transporter object using the default SMTP transport
    let mSettings = {}
    mSettings = {
        auth: null,
        secure: false,
        host: settings.host,
        port: settings.port,
        from: settings.from,
    }
    let transporter = nodemailer.createTransport(mSettings)
    // setup email data with unicode symbols
    let mailOptions = {}
    mailOptions.to = options.to
    mailOptions.cc = options.cc
    mailOptions.bcc = options.bcc
    mailOptions.attachments = options.attachments
    mailOptions.subject = options.subject
    mailOptions.text = options.text
    mailOptions.html = options.html
    if (options.content) {
        if (options.contentType === 'text/plain') {
            mailOptions.text = options.content
        } else {
            mailOptions.html = options.content
        }
    }
    // sender
    mailOptions.from = mSettings.from
    // send mail with defined transport object
    // mailOptions = {
    //     to: ['mrityunjay.mukherjee@ril.com'],
    //     contentType: 'text/html',
    //     subject: 'Auction 41',
    //     html: 'Dear Sir/Madam, This is system generated e-mail. Please do not reply.',
    //     from: 'mrityunjay.mukherjee@ril.com',
    // }
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            // return console.log(error)
            return cb(error, null)
        }
        return cb(null, info)
    })
}
