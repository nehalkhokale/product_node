const EventEmitter = require('events')
const myEmitter = new EventEmitter()
const mailer = require('../utility/Mailer')
const Email = require('../models/Email')
myEmitter.on('sendMail', (a, b) => {
    // console.log(`options ${a} and settings ${b.settings.email}`)
    mailer.mail(a, b.settings.email, (err, done) => {
        let _status = 'submitted'
        let _result = {}
        if (err) {
            _status = 'error'
            _result = err
            console.error(`ERROR: error while sending mail ${err.message}`)
        } else {
            _status = 'sent'
            _result = done
        }
        Email.findByIdAndUpdate(a._id, {
            $set: {
                status: _status,
                result: _result,
            },
        }, (err, doc) => { })
    })
})
module.exports = myEmitter
