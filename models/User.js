const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const autoIncrement = require('mongoose-auto-increment')

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: [true, 'can\'t be blank'],
        match: [/\S+@\S+\.\S+/, 'is invalid'],
        index: true,
    },
    name: {
        salutation: String,
        firstName: {
            type: String,
            index: true,
            required: [true, 'can\'t be blank'],

        },
        middleName: {
            type: String,
            index: true,
        },
        lastName: {
            type: String,
            index: true,
            required: [true, 'can\'t be blank'],
            
        },
        suffix: String,
        // required: [true, 'can\'t be blank']

        
    },
    mobile: {
        type:Number,
    },   
    address: {
        type: mongoose.Schema.Types.Mixed,
    },
    gender: {
        type: String,
        index: true,
    },
    isActive:{
        type:Boolean,
        default:true
    },
    role:{
        type: Number,
        ref: 'Role',
        default: 1
    },
    budget:{
        type:{
            type: String,
            enum: ['Month','Year'],
        },
        value: {
            type:Number
        },
        firstTrigger:{
            type:Number
        },
        lastTrigger:{
            type:Number
        }
    },
    // role:{
    //     type: String,
    //     enum: ['Admin','User'],
    //     default:'Admin'
    // },
    createdBy: {
        type: mongoose.Schema.Types.Mixed,
    },
    updatedBy: {
        type: mongoose.Schema.Types.Mixed,
    },
    remarks:{
        type: String,
},
    hash: String,
    salt: String,
}, {
    timestamps: true,
})

autoIncrement.initialize(mongoose.connection)

UserSchema.plugin(uniqueValidator, {
    message: 'is already taken.',
})

UserSchema.plugin(autoIncrement.plugin, 'User')

// UserSchema.methods.toJSON = function() {
//     let obj = this.toObject()
//     delete obj.hash
//     return obj
// }

const User = mongoose.model('User', UserSchema)
module.exports = User
