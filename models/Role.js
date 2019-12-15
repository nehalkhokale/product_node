const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const autoIncrement = require('mongoose-auto-increment')

const RolesSchema = new mongoose.Schema({
    name: {
        type: String,
        // lowercase: true,
        unique: true,
        required: [true, 'can\'t be blank'],
        index: true,
        alias: 'role',
    },
    description: {
        type: String,
    },
    remarks:{
        type: String,
    },
    createdBy: String,
    updatedBy: String,
    isActive: {
        type: Boolean,
        default: true,
        index: true,
    },
}, {
    timestamps: true,
})

autoIncrement.initialize(mongoose.connection)
RolesSchema.plugin(uniqueValidator, {
    message: 'is already taken.',
})
RolesSchema.plugin(autoIncrement.plugin, 'Role')
const Role = mongoose.model('Role', RolesSchema)

module.exports = Role
