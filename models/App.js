const mongoose = require('mongoose')
const Schema = mongoose.Schema

const appSchema = new Schema({
    name: {
        type: String,
    },
    referenceUrl: {
        type: String,
    },
    origin: {
        type: String,
    },
    settings: {
        attachment: {
            to: {
                type: String,
                default: 'attachments',
            },
            fileFilter: [{
                type: String,
            }],
            filesize: {
                type: Number,
            },
        },
        email: {
            from: {
                type: String,
            },
            host: {
                type: String,
            },
            port: {
                type: Number,
            },
            secure: {
                type: Boolean,
                default: false,
            },
            auth: {
                user: {
                    type: String,
                },
                pass: {
                    type: String,
                },
            },
        },
        sms: {
            sender: {
                type: String,
            },
            apiToken: {
                type: String,
            },
            host: {
                type: String,
            },
            port: {
                type: Number,
            },
            secure: {
                type: Boolean,
                default: false,
            },
            auth: {
                user: {
                    type: String,
                },
                pass: {
                    type: String,
                },
            },
        },
        hook: {
            sender: {
                type: String,
            },
            action: {
                type: String,
            },
            host: {
                type: String,
            },
            port: {
                type: Number,
            },
            secure: {
                type: Boolean,
                default: false,
            },
            auth: {
                user: {
                    type: String,
                },
                pass: {
                    type: String,
                },
            },
        },
    },
    createdBy: {
        type: String,
    },
}, {
    timestamps: true,
})

const app = mongoose.model('app', appSchema)
module.exports = app
