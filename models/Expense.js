const mongoose = require('mongoose')
const Schema = mongoose.Schema
const autoIncrement = require('mongoose-auto-increment')

const expenseSchema = new Schema({
    ExpenseDetails: [{

        categoryObj: {
            _id: {
                type: Number,
                ref:'Category',
                index: true,
                require:true
            },
            subCategory: [{
                name: {
                    type: String,
                    index: true,
                },
                amount: {
                    type: Number,
                    require:true
                }, 
                paymentMode:{
                    type: String,
                    enum: ['Check','Cash','Debit card','Credit card','Paytm','Googlepay','Phonepay'],
                    // default: 'Cash',
                    index: true,
                }, 
                isActive:{
                    type:Boolean,
                    default:true,
                } ,
                details:[{
                    amount: {
                        type: Number,
                        // require:true
                    }, 
                    paymentMode:{
                        type: String,
                        enum: ['Check','Cash','Debit card','Credit card','Paytm','Googlepay','Phonepay'],
                        // default: 'Cash',
                        index: true,
                    }, 
                    createdOn:{
                        type: Date,
                        default: Date.now,
                    }
                }] ,
                totalValue:{
                    type: Number,
                    default: 0,
                    // require:true
                },     
            },],
            createdBy: {
                type: mongoose.Schema.Types.Mixed,
            },
            updatedBy: {
                type: mongoose.Schema.Types.Mixed,
            },
            remarks: [
                {
                    comment: {
                        type: String,
                        // require:true
    
                    },
                    commentBy: {
                        type: String,
    
                    },
                    commentOn: {
                        type: Date,
                        default: Date.now,
    
                    },
                    version: {
                        type: mongoose.Schema.Types.Mixed,
    
                    },
    
                },
    
            ],
            notes:{
                type: String,
            },
            isActive:{
                type:Boolean,
                default:true,
            }
        },
        // category: {
        //     type: Number,
        //     ref:'Category',
        //     index: true,
        //     require:true

        // },
        // subCatDetails: [{
        //     subCategory: {
        //         type: String,
        //         index: true,
        //     },
        //     amount: {
        //         type: Number,
        //         require:true
        //     }, 
        //     paymentMode:{
        //         type: String,
        //         enum: ['Check','Cash','Debit card','Credit card','Paytm','Googlepay','Phonepay'],
        //         default: 'Cash',
        //         index: true,
        //     }, 
        //     isActive:{
        //         type:Boolean,
        //         default:true,
        //     }         
        // },],
        
    }],
    createdBy: {
        type: mongoose.Schema.Types.Mixed,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    expenseDate: {
        type: Date,
        required: [true, 'can\'t be blank'],
        // default: Date.now,
    },
}, {
    timestamps: true,
})

autoIncrement.initialize(mongoose.connection)

// expenseSchema.plugin(uniqueValidator, {
//     message: 'already exists.',
// })
expenseSchema.plugin(autoIncrement.plugin, 'expense')
const expense = mongoose.model('expense', expenseSchema)
module.exports = expense
