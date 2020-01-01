const Expense = require('../models/Expense')
const Category = require('../models/Category')

handleError = function(err, req, res, next) {
        res.status(500).send({success: false, error: true, message: `${err.message}`})
    }
module.exports.createExpense =  function(req,res,next){
    let expense = req.body
    let data = []
    // let numberCheck = "^[0-9]*$"
    let _userInfo = req.session.userInfo
    // console.log('---_userInfo',_userInfo);
    
    let createdBy = {
        _id: _userInfo._id,
        email: _userInfo.email ? _userInfo.email : null,
        name: _userInfo.name ? _userInfo.name : null,
        org: _userInfo.org ? _userInfo.org : null,
        mobile: _userInfo.mobile ? _userInfo.mobile : null,
    }
    expense.createdBy = createdBy
    // let subCategory=[]
  for(var exp =0 ; exp<  expense.ExpenseDetails.length ;exp++){
    // expense.ExpenseDetails.forEach((ele,i)=>{
        // console.log('---ele', ele);        
        let subCategory=[]
        expense.ExpenseDetails[exp].categoryObj.subCategory.forEach((element,index)=>{                        
            if(element.amount && element.paymentMode){
                // if(element.amount == /^[0-9]+$/){
                    subCategory=subCategory.concat(element)   
                // }        
            
            }
            if( expense.ExpenseDetails[exp].categoryObj.subCategory.length -1 ===  index ){
                expense.ExpenseDetails[exp].categoryObj.subCategory=subCategory
                if(expense.ExpenseDetails[exp].categoryObj.subCategory.length>0) {
                    data = data.concat(expense.ExpenseDetails[exp])
                }

                    if(expense.ExpenseDetails.length -1 ===  exp){
                        expense.ExpenseDetails=data
                        // console.log('--expense',expense);
                        if(expense.ExpenseDetails.length > 0){
                            Expense.find({}, function(err,expenseUpdate){
                               
                                let flag = false
                                let data 
                                // expenseUpdate.forEach((exp,array)=>{
                                    // if(expense.createdBy){                                    
                                // expenseUpdate.forEach((date,i) => {
                                // if(i === expense.ExpenseDetails.length - 1){
                                loop:for(var i=0;i<expenseUpdate.length;i++){
                                    // console.log('--expenseUpdate',((new Date(expenseUpdate[i].expenseDate) >=new Date(new Date(expense.expenseDate).setHours(0, 0, 0, 0)) )&&
                                    // (new Date((expenseUpdate[i].expenseDate)) <= new Date(new Date(expense.expenseDate).setHours(23, 59, 59, 999)))
                                    // ));
    
                                        if(((new Date(expenseUpdate[i].expenseDate) >=new Date(new Date(expense.expenseDate).setHours(0, 0, 0, 0)) )&&
                                        (new Date((expenseUpdate[i].expenseDate)) <= new Date(new Date(expense.expenseDate).setHours(23, 59, 59, 999)))
                                        && expense.createdBy._id === expenseUpdate[i].createdBy._id)){
                                            flag = true
                                            data ={
                                                _id:expenseUpdate[i]._id,
                                                flag:flag
                                            }
                                            createAndEdit(expenseUpdate[i],expense,flag,data)
                                            break loop
    
                                        }else{
                                            flag = false                                        
                                            data ={
                                               
                                                flag:flag
                                            }
                                            if( i === expenseUpdate.length-1){
                                                
                                                createAndEdit(expenseUpdate[i],expense,flag,data)
                                                break loop
                                            }
                                        }
                                        
                                        // console.log('--data',expenseUpdate[i]);
                                }
                            // }
                                    
                                     
                                    //  })
                                    //  createAndEdit(data,expense,flag)
                                    
                                   
                                // })
                                    // }
                                
                            })
                            
                           
                        }
                    }
                
            }

        })
    // })
    // Expense.findById(expense, function(err,Update){
    //     if (err) return handleError(err,req,res,next)
    //     else
    //     res.json({success: true, error: false, message:'expense '+ _id +'  updated', data:Update})

    // })
    
  }
    
}
function createAndEdit (edit,expense,flag,data){
    console.log('flag',expense);
    
    if(flag){
        let catIndex 
        Expense.findById(data._id, async function(err,expenseUpdate){
        for(var j = 0 ; j<expense.ExpenseDetails.length ;j++){        
            for(var k=0;k<edit.ExpenseDetails.length;k++){
                console.log('----initial');
                
                    if(edit.ExpenseDetails[k].categoryObj._id === expense.ExpenseDetails[j].categoryObj._id){
                        console.log('---if ===');                        
                        catIndex=k
                        let index
                        let newCategory = []
                        let arrayK=[]
                        let sameSub = false
                        
                        for(var l = 0; l<expense.ExpenseDetails[j].categoryObj.subCategory.length;l++){
                            console.log('---- in 3 rd for');
                            let sameSubUpdate
                            for(var m = 0; m<edit.ExpenseDetails[k].categoryObj.subCategory.length;m ++){
                                console.log('--- in 4 th for');
                                
                                let jValue =JSON.parse(JSON.stringify(j)) 
                                let lValue =JSON.parse(JSON.stringify(l)) 
                                let subCatIndex = JSON.parse(JSON.stringify(m)) 
                                if(edit.ExpenseDetails[catIndex].categoryObj.subCategory[subCatIndex].name === expense.ExpenseDetails[jValue].categoryObj.subCategory[lValue].name){
                                    console.log('---in first loop if ',jValue,lValue,subCatIndex,catIndex);
                                    sameSub = true
                                    await Expense.findOneAndUpdate(
                                        {
                                            '_id':data._id,
                                            'ExpenseDetails.categoryObj._id':edit.ExpenseDetails[catIndex].categoryObj._id,
                                        },
                                        {
                                            $set:{
                                             [`ExpenseDetails.${catIndex}.categoryObj.subCategory.${subCatIndex}.amount`]:(expense.ExpenseDetails[jValue].categoryObj.subCategory[lValue].amount +
                                             edit.ExpenseDetails[catIndex].categoryObj.subCategory[subCatIndex].amount),
                                             [`ExpenseDetails.${catIndex}.categoryObj.subCategory.${subCatIndex}.paymentMode`]:expense.ExpenseDetails[jValue].categoryObj.subCategory[lValue].paymentMode,
                                             [`ExpenseDetails.${catIndex}.categoryObj.subCategory.${subCatIndex}.details`]:(edit.ExpenseDetails[catIndex].categoryObj.subCategory[subCatIndex].details!= null) ? edit.ExpenseDetails[catIndex].categoryObj.subCategory[subCatIndex].details.concat(
                                                    expense.ExpenseDetails[jValue].categoryObj.subCategory[lValue]):expense.ExpenseDetails[jValue].categoryObj.subCategory[lValue]
                                            }
                                        }, 
                                        {new: true },  function(err,Update1){
                                        if (err) console.log('-- 2 err',err);
                                        
                                        else{
                                            sameSubUpdate =Update1
                                            console.log('---here 4',[`ExpenseDetails.${catIndex}.categoryObj.subCategory.${subCatIndex}.amount`],[`ExpenseDetails.${catIndex}.categoryObj.subCategory.${subCatIndex}.paymentMode`],expense.ExpenseDetails[jValue].categoryObj.subCategory[lValue].paymentMode);
                                            console.log('---- 44',expense.ExpenseDetails[jValue].categoryObj.subCategory[lValue].amount +
                                            edit.ExpenseDetails[catIndex].categoryObj.subCategory[subCatIndex].amount ,Update1.ExpenseDetails[0].categoryObj.subCategory[0]);
                                            
                                        }
                                
                                    })

                                }else{
                                    newCategory =newCategory.concat( expense.ExpenseDetails[j].categoryObj.subCategory[l])
                                   
                                    arrayK=k
                                    if( lValue=== expense.ExpenseDetails[jValue].categoryObj.subCategory.length -1 && 
                                        subCatIndex === edit.ExpenseDetails[catIndex].categoryObj.subCategory.length-1 ){
                                        console.log('---jValue  jValue',jValue,lValue,subCatIndex,catIndex );
                                            console.log('--newCategory',newCategory , sameSubUpdate);
                                         await Expense.findOneAndUpdate(
                                        {
                                            '_id':data._id,
                                            'ExpenseDetails.categoryObj._id':edit.ExpenseDetails[catIndex].categoryObj._id,
                                        },
                                        {
                                            $set:{
                                                [`ExpenseDetails.${catIndex}.categoryObj.subCategory`]:edit.ExpenseDetails[k].categoryObj.subCategory.concat(
                                                    newCategory),
                                                // [`ExpenseDetails.${catIndex}.categoryObj.subCategory.${subCatIndex}.details`]: expense.ExpenseDetails[jValue].categoryObj.subCategory[lValue],
                                                
                                            }
                                        }, 
                                        {new: true }, async function(err,Update2){

                                            index = Update2.ExpenseDetails[catIndex].categoryObj.subCategory.length - newCategory.length
                                            // console.log(index);
                                            
                                            console.log('---index',index,jValue,lValue,subCatIndex,catIndex , Update2.ExpenseDetails[catIndex].categoryObj.subCategory);
                                            
                                        if (err) console.log('err here 1',err);
                                        else{
                                        console.log('----here 0');
                                        //   Expense.findOneAndUpdate(
                                        //     {
                                        //         '_id':data._id,
                                        //         'ExpenseDetails.categoryObj._id':edit.ExpenseDetails[catIndex].categoryObj._id,
                                        //     },
                                        //     {
                                        //         $set:{                                                       
                                        //             [`ExpenseDetails.${catIndex}.categoryObj.subCategory.${index}.details`]: expense.ExpenseDetails[jValue].categoryObj.subCategory[lValue]
                                        //         }
                                        //     }, 
                                        //     {new: true }, function(err,Update3){
                                        //         if (err) console.log('---erre',err);
                                        //         index=index+1
                                        //         // console.log('---here 2',Update3.ExpenseDetails[0].categoryObj.subCategory[0] ,[`ExpenseDetails.${catIndex}.categoryObj.subCategory.${index}.details`]) ;
                                        //         // console.log('---here 2-----',expense.ExpenseDetails[jValue].categoryObj.subCategory[lValue]);

                                                
                                        //     })
                                           
                                        }
                                
                                    })
                                }
                                //     console.log('----here 1');
                                }

                            
                            }
                            
                        }
                        
                    
                        
                        // // return()
                    }else{
                        console.log('---here 3',j);

                        await Expense.findOneAndUpdate(
                            {
                                '_id':data._id,
                                'ExpenseDetails._id':edit.ExpenseDetails[k]._id,
                            },
                            {
                                $set:{
                                 
                                 [`ExpenseDetails`]:edit.ExpenseDetails.concat(
                                    expense.ExpenseDetails[j]),
                                }
                            }, 
                            {new: true }, function(err,Update){
                                console.log('---here 4',Update , j);
                            // if (err) return handleError(err,req,res,next)
                            // else{
                            // }
                    
                        })
                    }
                // })
            }
            
        
        
        }})
    // })
    }else{
        Expense.create(expense,function(err,expenseDoc){
            console.log('---created');
            
            if (err) console.log('err',err);
            
            else{
                for(var n =0 ;n <expenseDoc.ExpenseDetails.length ;n++){
                    for(var o = 0; o<expense.ExpenseDetails[n].categoryObj.subCategory.length;o ++){
                        console.log('n m', n, o);

                        Expense.findOneAndUpdate(
                            {
                                '_id':expenseDoc._id,
                                'ExpenseDetails.categoryObj._id':expenseDoc.ExpenseDetails[n].categoryObj._id,
                            },
                            {
                                $set:{                                                       
                                    [`ExpenseDetails.${n}.categoryObj.subCategory.${o}.details`]: expense.ExpenseDetails[n].categoryObj.subCategory[o]
                                }
                            }, 
                            {new: true }, function(err,Update){
                                if (err) console.log('--err',err);
                                console.log('n m', n, o);
                                
                                
        
                            })
                    }
                    
                }
               
                // return(expenseDoc)
                // res.json({success: true, error: false, message: 'expense Added',data: expenseDoc})
            }
        })
    }
}
module.exports.addSubCategory = function(req,res,next){
    let addCategoryId = req.params.id
    Category.findById(addCategoryId, function(err,getSubCategory){
        if (err) return handleError(err,req,res,next)
        else
        // console.log('----getSubCategory',getSubCategory.categoryObj.subCategory.name);
        
        res.json({success: true, error: false, message:'category '+ addCategoryId +'  updated', data:getSubCategory})

    })
}

// module.exports.updateExpense = function (req,res,next){
//     let _id = req.params.id
//     let expense = req.body
//     Expense.findByIdAndUpdate(_id,expense, {new: true }, function(err,expenseUpdate){
//         if (err) return handleError(err,req,res,next)
//         else
//         res.json({success: true, error: false, message:'expense '+ _id +'  updated', data:expenseUpdate})

//     })
// }

module.exports.updateExpense = function (req,res,next){
    let _id = req.params.id
    let expense = req.body
    Expense.findById(_id, function(err,expenseUpdate){
        if (err) return handleError(err,req,res,next)
        // console.log('expenseUpdate',expenseUpdate);
        // console.log('expense.ExpenseDetails',expense.ExpenseDetails);
        
        let update = expenseUpdate.ExpenseDetails.push(expense.ExpenseDetails[0])
        Expense.findByIdAndUpdate(_id,expenseUpdate, {new: true }, function(err,Update){
            if (err) return handleError(err,req,res,next)
            else
            res.json({success: true, error: false, message:'expense '+ _id +'  updated', data:Update})
    
        })
        // 
        // else
        // res.json({success: true, error: false, message:'expense '+ _id +'  updated', data:expenseUpdate})

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


        let index = doc.expenseOn.subCategory.map(function(e) {
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


        let index = doc.expenseOn.subCategory.map(function(e) {
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
