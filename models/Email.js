const mongoose = require('mongoose')
const Schema = mongoose.Schema

const emailSchema = new Schema({
    appId: {
        type: Schema.Types.ObjectId,
        ref: 'app',
    },
    to: [{
        type: String,
    }],
    subject: {
        type: String,
    },
    cc: {
        type: String,
    },
    bcc: {
        type: String,
    },
    contentType: {
        type: String,
        enum: ['text/plain', 'text/html'],
        default: 'text/plain',
    },
    content: {
        type: String,
    },
    text: {
        type: String,
    },
    html: {
        type: String,
    },
    attachments: [
        {
            filename: {type: String},
            content: {type: String},
            contentType: {type: String},
        },
    ],
    attachmentCount: {
        type: Number,
        default: 0,
    },
    requestedBy: {
        type: String,
    },
    status: {
        type: String,
        enum: ['submitted', 'inprogress', 'sent', 'error'],
        default: 'submitted',
    },
    result: {
        type: Schema.Types.Mixed,
    },
}, {
    timestamps: true,
})

const email = mongoose.model('email', emailSchema)
module.exports = email
