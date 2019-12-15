const Expense = require('../models/Expense')
const Category = require('../models/Category')

handleError = function(err, req, res, next) {
        res.status(500).send({success: false, error: true, message: `${err.message}`})
    }
module.exports.createExpense = function(req,res,next){
    let expense = req.body
    Expense.create(expense,function(err,expenseDoc){
        if (err) return handleError(err,req,res,next)
        else
        res.json({success: true, error: false, message: 'expense Added',data: expenseDoc})
    })
}
module.exports.addSubCategory = function(req,res,next){
    let addCategoryId = req.params.id
    Category.findById(addCategoryId, function(err,getSubCategory){
        if (err) return handleError(err,req,res,next)
        else
        console.log('----getSubCategory',getSubCategory.subCategory.name);
        
        res.json({success: true, error: false, message:'category '+ addCategoryId +'  updated', data:getSubCategory})

    })
}

module.exports.updateExpense = function (req,res,next){
    let _id = req.params.id
    let expense = req.body
    Expense.findByIdAndUpdate(_id,expense, {new: true }, function(err,expenseUpdate){
        if (err) return handleError(err,req,res,next)
        else
        res.json({success: true, error: false, message:'expense '+ _id +'  updated', data:expenseUpdate})

    })
}

module.exports.getAllExpense= function(req,res,next){
    let _filter = req.query.filter
    let allExpense = {}

    if (_filter) {
        allExpense = JSON.parse(_filter)
    }    
    Expense.find(allExpense).exec( function(err, allExpenseDoc) {
        if (err) return handleError(err, req, res, next)
       
        res.json({error: false, success: true, message: '', data: allExpenseDoc})
    })

}

module.exports.notAciveExpense=function(req,res,next){
    let _id = req.params.id
    Expense.updateOne({_id},{isActive:false}, function(err,deletedDoc){
        if (err) return handleError(err,res,req,next)
        else
        res.json({success: true, error: false, message: 'user '+ _id+' is deleted', data: deletedDoc})
    })



}
module.exports.deleteExpense=function(req,res,next){
    let _id = req.params.id
    let expense =  req.body
    console.log('expense',expense);
    
    Expense.findOne({_id}).exec( function(err,doc){

        console.log('details',doc.expenseOn[1]._id.toString(),
        doc.expenseOn[0]._id, expense,  expense._id)

        // if(doc.expenseOn[0]._id.toString() == expense._id.toString()){
        //     console.log('Hey we are eqaul')
        // }else{
        //     console.log(':-(')
        // }


        let index = doc.expenseOn.map(function(e) {
            return e._id.toString()
        }).indexOf(expense._id.toString())

        console.log('index',index)  

        Expense.findOneAndUpdate({'_id':_id,'expenseOn._id':expense._id},
        {
            $set:{[`expenseOn.${index}.isActive`]: false},
        },{new: true},(err,deletedexpenseDoc)=>{
            if (err) return handleError(err,res,req,next)
            else
            res.json({success: true, error: false, message: 'user '+ expense.subCategory+' is deleted', data: deletedexpenseDoc})
        })
    })


}
module.exports.report = function(req,res,err){
    let expense = req.body
    if (err) return handleError(err,res,req,next)    
    Expense.find({},(err,doc)=>{
        let i = []
        if(expense.startDate){
        doc.forEach(function(ele, index){
        console.log('ele.expenseDate',ele.expenseDate,new Date(new Date(expense.startDate).setHours(0, 0, 0, 0)),(new Date(expense.startDate).setHours(0, 0, 0, 0)) ,new Date(new Date(expense.endDate).setHours(0, 0, 0, 0)));
        let dateObj =new Date(ele.expenseDate)>= new Date(new Date(expense.startDate).setHours(0, 0, 0, 0)) 
                    && new Date(ele.expenseDate) <= new Date(new Date(expense.endDate).setHours(23, 59, 59, 999)) 
        console.log('dateObj',dateObj);
            if(dateObj){
                i = i.concat(ele)
            }
        })
        res.json({success: true, error: false, message: 'expense  data', data: i})
    }
    // res.json({success: true, error: false, message: 'expense  data', data: i})
    
    })
}
module.exports.setNotActiveExpense = function(req,res,next){
    let _id = req.params.id
    let expense =  req.body
    console.log('expense',expense);
    Expense.findOne({_id}).exec( function(err,doc){

        console.log('details',doc)

        // if(doc.expenseOn[0]._id.toString() == expense._id.toString()){
        //     console.log('Hey we are eqaul')
        // }else{
        //     console.log(':-(')
        // }


        let index = doc.expenseOn.subCatDetails.map(function(e) {
            return e._id.toString()
        }).indexOf(expense._id.toString())

        console.log('index',index)  

        Expense.findOneAndUpdate({'_id':_id,'expenseOn._id':expense._id},
        {
            $set:{[`expenseOn.${index}.isActive`]: false},
        },{new: true},(err,deletedexpenseDoc)=>{
            if (err) return handleError(err,res,req,next)
            else
            res.json({success: true, error: false, message: 'user '+ expense.subCategory+' is deleted', data: deletedexpenseDoc})
        })
    })


}
module.exports.setNotActiveSubCat = function(req,res,next){
    let _id = req.params.id
    let expense =  req.body
    console.log('expense',expense);
    Expense.findOne({_id}).exec( function(err,doc){

        console.log('details',doc)

        // if(doc.expenseOn[0]._id.toString() == expense._id.toString()){
        //     console.log('Hey we are eqaul')
        // }else{
        //     console.log(':-(')
        // }


        let index = doc.expenseOn.subCatDetails.map(function(e) {
            return e._id.toString()
        }).indexOf(expense._id.toString())

        console.log('index',index)  

        Expense.findOneAndUpdate({'_id':_id,'expenseOn._id':expense._id},
        {
            $set:{[`expenseOn.${index}.isActive`]: false},
        },{new: true},(err,deletedexpenseDoc)=>{
            if (err) return handleError(err,res,req,next)
            else
            res.json({success: true, error: false, message: 'user '+ expense.subCategory+' is deleted', data: deletedexpenseDoc})
        })
    })


}
