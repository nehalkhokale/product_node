const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const autoIncrement = require("mongoose-auto-increment")

const rentSchema = new mongoose.Schema({
    address: {
        type: String,
        unique:true
    },
    item:[{
            name :{
                type: String,
                unique:true
            },
            isActive:{
                type:Boolean,
                default:true,
            }
    }],
    price:{
        type:Number,
    },
    isActive:{
        type:Boolean,
        default:true,
    },
    isRented:{
        type:Boolean,
        default:false,
    },
    tenant:{
        type: mongoose.Schema.Types.Mixed, 
    },
    ownerName: {
        type: mongoose.Schema.Types.Mixed,
    },
    updatedBy: {
        type: mongoose.Schema.Types.Mixed,
    },
    remarks: {      
        type: String,
    }
}, {
    timestamps: true,
})

autoIncrement.initialize(mongoose.connection)

rentSchema.plugin(uniqueValidator, {
    message: 'already exists.',
})
rentSchema.plugin(autoIncrement.plugin, 'Rent')
const Rent = mongoose.model('Rent', rentSchema)
module.exports = Rent
