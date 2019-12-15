const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const autoIncrement = require("mongoose-auto-increment")

const categorySchema = new mongoose.Schema({
    category: {
        type: String,
        unique:true
    },
    subCategory:[{
            name :{
                type: String,
                unique:true
            },
            isActive:{
                type:Boolean,
                default:true,
            }
    }],
    isActive:{
        type:Boolean,
        default:true,
    },
    createdBy: {
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

categorySchema.plugin(uniqueValidator, {
    message: 'already exists.',
})
categorySchema.plugin(autoIncrement.plugin, 'Category')
const Category = mongoose.model('Category', categorySchema)
module.exports = Category
