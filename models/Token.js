const mongoose = require('mongoose')
const Schema = mongoose.Schema
const uniqueValidator = require('mongoose-unique-validator')

const tokenSchema = new Schema({
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, 'can\'t be blank'],
        match: [/\S+@\S+\.\S+/, 'is invalid'],
        index: true,
        alias: 'username',
    },
    token: {
        type: String,
        unique: true,
    },
    createdAt: {
        type: Schema.Types.Date,
        default: Date.now,
        index: {expireAfterSeconds: 86400},
    },
})


tokenSchema.plugin(uniqueValidator, {
    message: 'already exists.',
})


const token = mongoose.model('token', tokenSchema)
module.exports = token
