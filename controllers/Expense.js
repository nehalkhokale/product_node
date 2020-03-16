const Expense = require('../models/Expense')
const Category = require('../models/Category')
"use strict";
handleError = function (err, req, res, next) {
    res.status(500).send({ success: false, error: true, message: `${err.message}` })
}
module.exports.createExpense = function (req, res, next) {
    let expense = req.body
    let expenseDup = JSON.parse(JSON.stringify(expense))
    let data = []
    // let numberCheck = "^[0-9]*$"
    let _userInfo = req.session.userInfo
    // console.log('---_userInfo',_userInfo);
    let Respflag = false
    let detail
    let createdBy = {
        _id: _userInfo._id,
        email: _userInfo.email ? _userInfo.email : null,
        name: _userInfo.name ? _userInfo.name : null,
        org: _userInfo.org ? _userInfo.org : null,
        mobile: _userInfo.mobile ? _userInfo.mobile : null,
    }
    expense.createdBy = createdBy
    // let subCategory=[]
    if(expense.expenseDate){
        Respflag= true
        initialLoop: for (var exp = 0; exp < expense.ExpenseDetails.length; exp++) {
              
            let subCategory = []
            // console.log('--in loop 1');
                loop2: for (var index = 0; index < expenseDup.ExpenseDetails[exp].categoryObj.subCategory.length; index++) {

                    // expense.ExpenseDetails[exp].categoryObj.subCategory.forEach((element, index) => {
                    // console.log('--in loop 2');
                    
                    if (expense.ExpenseDetails[exp].categoryObj && expense.ExpenseDetails[exp].categoryObj.subCategory[index].amount && expense.ExpenseDetails[exp].categoryObj.subCategory[index].paymentMode) {
                        // if(element.amount == /^[0-9]+$/){
                        subCategory = subCategory.concat(expense.ExpenseDetails[exp].categoryObj.subCategory[index])
                        // }
                        console.log('-- if in loop 2');
    
                    }
                    console.log(' here man');
                    
                    if (expense.ExpenseDetails[exp].categoryObj.subCategory.length - 1 === index) {
                        
                        expense.ExpenseDetails[exp].categoryObj.subCategory = subCategory
                        console.log('-- final in loop 2',expense.ExpenseDetails[exp].categoryObj);
    
                        if (expense.ExpenseDetails[exp].categoryObj.subCategory.length > 0) {
    
                            data = data.concat(expense.ExpenseDetails[exp]);
                            console.log('-- manananan in loop 2',data);
    
                        }
                        if(data.length > 0){
                            console.log('--here in data lenght >0',expense.ExpenseDetails[exp].categoryObj.subCategory.length);
                            
                        if (expense.ExpenseDetails.length - 1 === exp) {
                            expense.ExpenseDetails = data
                            console.log('--expense',expense);
                            // if (expense.ExpenseDetails.length > 0) {
                            // }
                            
                        }
                    }else if(!Respflag){
                        res.json({success: false, error: true, message: 'NO exepense found ,Please enter expenses', data: []})
    
                    }
                    console.log('-- out of here in data lenght >0');
    
                    }
                    console.log('--00 if --',expense.ExpenseDetails[exp],exp);
                    
                }
                console.log('--00 if --2');
            
            console.log('---here--- in 1st if');

            // })
        }
    }else if(!Respflag){
        res.json({success: false, error: true, message: 'Please enter valid date', data: []})
        }


    dateMatch(expense).then((data)=>{

        createAndEdit(data.expenseUpdate, expense, data.flag, data)
        // console.log('-------------final logs with valid subcat',expense.ExpenseDetails[0].categoryObj.subCategory);
    })
    // .then((resdetailsUpdate)=>{
    //     console.log('---detailsUpdate');
    //     return detailsUpdate (data.expenseUpdate,data)
    // })
    .then((data)=>{
        res.json({success: true, error: false, message: 'Contract updated', data: data})
    })
    .catch((e)=>{
        console.log('----catch ',e); 
    });

    console.log('We are here');

   
}
function dateMatch(expense){
    return  new Promise ((resolve,reject)=>{
        Expense.find({}, function (err, expenseUpdate) {                           
             if (err) {
                 reject(err)
             }               
            let data
            let flag = false
            detail = data
            loop: for (var i = 0; i < expenseUpdate.length; i++) {
                
    
                if (((new Date(expenseUpdate[i].expenseDate) >= new Date(new Date(expense.expenseDate).setHours(0, 0, 0, 0))) &&
                    (new Date((expenseUpdate[i].expenseDate)) <= new Date(new Date(expense.expenseDate).setHours(23, 59, 59, 999)))
                    && expense.createdBy._id === expenseUpdate[i].createdBy._id)) {
                    flag = true
                    data = {
                        _id: expenseUpdate[i]._id,
                        flag: flag,
                        expenseUpdate :expenseUpdate[i]
                    }

                    resolve(data)
                    // console.log('-----once haaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa  iffff --------------------------------');
                    // createAndEdit(expenseUpdate[i], expense, flag, data)
                    // break
                    // break initialLoop;
    
                } else {
                    flag = false
                    data = {
                        expenseUpdate :expenseUpdate[i],
                        flag: flag
                    }
                    if (i === expenseUpdate.length - 1) {

                        // console.log('-----once haaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa --------------------------------');
                    resolve(data)
                        
                        // createAndEdit(expenseUpdate[i], expense, flag, data)
                        // break 
                        // break 
                        // break
                    }
                }
    
    
            }
    
    
        })
    })
    

}
function earlier(edit, expense, flag, data) {
    // console.log('flag', expense);

    if (flag) {
        let catIndex
        Expense.findById(data._id, async function (err, expenseUpdate) {
            for (var j = 0; j < expense.ExpenseDetails.length; j++) {
                for (var k = 0; k < edit.ExpenseDetails.length; k++) {
                    // console.log('----initial');

                    if (edit.ExpenseDetails[k].categoryObj._id === expense.ExpenseDetails[j].categoryObj._id) {
                        // console.log('---if ===');
                        catIndex = k
                        let index
                        let newCategory = []
                        let arrayK = []
                        let sameSub = false

                        for (var l = 0; l < expense.ExpenseDetails[j].categoryObj.subCategory.length; l++) {
                            // console.log('---- in 3 rd for');
                            let sameSubUpdate
                            for (var m = 0; m < edit.ExpenseDetails[k].categoryObj.subCategory.length; m++) {
                                // console.log('--- in 4 th for');

                                let jValue = JSON.parse(JSON.stringify(j))
                                let lValue = JSON.parse(JSON.stringify(l))
                                let subCatIndex = JSON.parse(JSON.stringify(m))
                                if (edit.ExpenseDetails[catIndex].categoryObj.subCategory[subCatIndex].name === expense.ExpenseDetails[jValue].categoryObj.subCategory[lValue].name) {
                                    // console.log('---in first loop if ', jValue, lValue, subCatIndex, catIndex);
                                    sameSub = true
                                    await Expense.findOneAndUpdate(
                                        {
                                            '_id': data._id,
                                            'ExpenseDetails.categoryObj._id': edit.ExpenseDetails[catIndex].categoryObj._id,
                                        },
                                        {
                                            $set: {
                                                [`ExpenseDetails.${catIndex}.categoryObj.subCategory.${subCatIndex}.amount`]: (expense.ExpenseDetails[jValue].categoryObj.subCategory[lValue].amount +
                                                    edit.ExpenseDetails[catIndex].categoryObj.subCategory[subCatIndex].amount),
                                                [`ExpenseDetails.${catIndex}.categoryObj.subCategory.${subCatIndex}.paymentMode`]: expense.ExpenseDetails[jValue].categoryObj.subCategory[lValue].paymentMode,
                                                [`ExpenseDetails.${catIndex}.categoryObj.subCategory.${subCatIndex}.details`]: (edit.ExpenseDetails[catIndex].categoryObj.subCategory[subCatIndex].details != null) ? edit.ExpenseDetails[catIndex].categoryObj.subCategory[subCatIndex].details.concat(
                                                    expense.ExpenseDetails[jValue].categoryObj.subCategory[lValue]) : expense.ExpenseDetails[jValue].categoryObj.subCategory[lValue]
                                            }
                                        },
                                        { new: true }, function (err, Update1) {
                                            if (err) console.log('-- 2 err', err);

                                            else {
                                                sameSubUpdate = Update1
                                                // console.log('---here 4', [`ExpenseDetails.${catIndex}.categoryObj.subCategory.${subCatIndex}.amount`], [`ExpenseDetails.${catIndex}.categoryObj.subCategory.${subCatIndex}.paymentMode`], expense.ExpenseDetails[jValue].categoryObj.subCategory[lValue].paymentMode);
                                                // console.log('---- 44', expense.ExpenseDetails[jValue].categoryObj.subCategory[lValue].amount +
                                                    // edit.ExpenseDetails[catIndex].categoryObj.subCategory[subCatIndex].amount, Update1.ExpenseDetails[0].categoryObj.subCategory[0]);

                                            }

                                        })

                                } else {
                                    newCategory = newCategory.concat(expense.ExpenseDetails[j].categoryObj.subCategory[l])

                                    arrayK = k
                                    if (lValue === expense.ExpenseDetails[jValue].categoryObj.subCategory.length - 1 &&
                                        subCatIndex === edit.ExpenseDetails[catIndex].categoryObj.subCategory.length - 1) {
                                        // console.log('---jValue  jValue', jValue, lValue, subCatIndex, catIndex);
                                        // console.log('--newCategory', newCategory, sameSubUpdate);
                                        await Expense.findOneAndUpdate(
                                            {
                                                '_id': data._id,
                                                'ExpenseDetails.categoryObj._id': edit.ExpenseDetails[catIndex]._id,
                                            },
                                            {
                                                $set: {
                                                    [`ExpenseDetails.${catIndex}.categoryObj.subCategory`]: edit.ExpenseDetails[k].categoryObj.subCategory.concat(
                                                        newCategory),
                                                    // [`ExpenseDetails.${catIndex}.categoryObj.subCategory.${subCatIndex}.details`]: expense.ExpenseDetails[jValue].categoryObj.subCategory[lValue],

                                                }
                                            },
                                            { new: true }, async function (err, Update2) {

                                                index = Update2.ExpenseDetails[catIndex].categoryObj.subCategory.length - newCategory.length
                                                // console.log(index);

                                                // console.log('---index', index, jValue, lValue, subCatIndex, catIndex, Update2.ExpenseDetails[catIndex].categoryObj.subCategory);

                                                if (err) console.log('err here ', err);
                                                else {
                                                    console.log('----here 0');
                                                    Expense.findOneAndUpdate(
                                                        {
                                                            '_id': data._id,
                                                            'ExpenseDetails.categoryObj._id': edit.ExpenseDetails[catIndex].categoryObj._id,
                                                        },
                                                        {
                                                            $set: {
                                                                [`ExpenseDetails.${catIndex}.categoryObj.subCategory.${index}.details`]: expense.ExpenseDetails[jValue].categoryObj.subCategory[lValue]
                                                            }
                                                        },
                                                        { new: true }, function (err, Update3) {
                                                            if (err) console.log('---erre', err);
                                                            index = index + 1
                                                            // console.log('---here 2',Update3.ExpenseDetails[0].categoryObj.subCategory[0] ,[`ExpenseDetails.${catIndex}.categoryObj.subCategory.${index}.details`]) ;
                                                            // console.log('---here 2-----',expense.ExpenseDetails[jValue].categoryObj.subCategory[lValue]);


                                                        })

                                                }

                                            })
                                    }
                                    //     console.log('----here 1');
                                }


                            }

                        }



                        // // return()
                    } else {
                        // console.log('---here 3', j);

                        await Expense.findOneAndUpdate(
                            {
                                '_id': data._id,
                                'ExpenseDetails._id': edit.ExpenseDetails[k]._id,
                            },
                            {
                                $set: {

                                    [`ExpenseDetails`]: edit.ExpenseDetails.concat(
                                        expense.ExpenseDetails[j]),
                                }
                            },
                            { new: true }, function (err, Update) {
                                console.log('---here 4', Update, j);
                                // if (err) return handleError(err,req,res,next)
                                // else{
                                // }

                            })
                    }
                    // })
                }



            }
        })
        // })
    } else {
        Expense.create(expense, function (err, expenseDoc) {
            // console.log('---created');

            if (err) console.log('err', err);

            else {
                for (var n = 0; n < expenseDoc.ExpenseDetails.length; n++) {
                    for (var o = 0; o < expense.ExpenseDetails[n].categoryObj.subCategory.length; o++) {
                        console.log('n m', n, o);

                        Expense.findOneAndUpdate(
                            {
                                '_id': expenseDoc._id,
                                'ExpenseDetails.categoryObj._id': expenseDoc.ExpenseDetails[n].categoryObj._id,
                            },
                            {
                                $set: {
                                    [`ExpenseDetails.${n}.categoryObj.subCategory.${o}.details`]: expense.ExpenseDetails[n].categoryObj.subCategory[o]
                                }
                            },
                            { new: true }, function (err, Update) {
                                if (err) console.log('--err', err);
                                // console.log('n m', n, o);
                            })
                    }

                }

                // return(expenseDoc)
                // res.json({success: true, error: false, message: 'expense Added',data: expenseDoc})
            }
        })
    }
}
let newSubCat
function createAndEdit(edit, expense, flag, data){
   
    return commonAndUncommonCat(expense, edit, data,flag).then((newData) => {
        // console.log('---commonAndUncommonCat');
        return AddUncommonCat(newData , edit ,expense,flag).then((repAddUncommonCat) => {
            // console.log('---AddUncommonCat');
            return UncommonSubcat(newData , repAddUncommonCat,flag)
            // .then((resUncommonSubcat)=>{
            //     console.log('---detailsUpdate');
            //     return detailsUpdate (edit,data ,resUncommonSubcat,flag)
            // }
            // )
        })
    }).catch((error)=>{

    })
    // .then((resUncommonSubcat)=>{
    //     return detailsUpdate (edit,data ,resUncommonSubcat)
    // })
}

// module.exports.areDifferentByIds = (req,res)=> {
//     let a = [req.body]
//     Expense.findById({'_id':310}, function (err, expenseUpdate) {
//         let b = [expenseUpdate]
//         let flag = false
//         let data

       
//         var idsA = a.map( function(x){ return x.id; } ).unique().sort();
//     var idsB = b.map( function(x){ return x.id; } ).unique().sort();
//     return (idsA.join(',') !== idsB.join(',') );

//     })
    
// }
// create(){

//     // 1. Identify the user


//     // 2. Check for current user are there any entries in expense table against same date
    
//     // 3. Create or update based on the 2nd condition

//     // 4. For loop to update - find and update

// }

function commonAndUncommonCat(expense, edit, data ,flag) {
   
    return new Promise(function (resolve, reject) {
        let commonCat = []
        let uncommonCat = []
        let newCategory = []
        let newSubData = []
        
        // Get common entries - let filteCom

        // Get uncommon entries - let filteUnc
        if (flag) {
            for (var j = 0; j < expense.ExpenseDetails.length; j++) {
                // console.log('---in first for expense.ExpenseDetails[j].categoryObj._id',expense.ExpenseDetails[j].categoryObj._id);
                let catFlag = false
                for (var k = 0; k < edit.ExpenseDetails.length; k++) {
                    // console.log('--- berfore',expense.ExpenseDetails[j].categoryObj._id,edit.ExpenseDetails[k].categoryObj._id );
                   
                    if (edit.ExpenseDetails[k].categoryObj._id === expense.ExpenseDetails[j].categoryObj._id) {
                        // console.log('--- iffffff',edit.ExpenseDetails[k].categoryObj._id);
                        catFlag = true
                        commonCat = commonCat.concat(expense.ExpenseDetails[j])
                        for (var l = 0; l < expense.ExpenseDetails[j].categoryObj.subCategory.length; l++) {
                            let  subFlag = false
                            for (var m = 0; m < edit.ExpenseDetails[k].categoryObj.subCategory.length; m++) {
                                if (edit.ExpenseDetails[k].categoryObj.subCategory[m].name ===
                                    expense.ExpenseDetails[j].categoryObj.subCategory[l].name) {
                                        subFlag = true
                                    Expense.findOneAndUpdate(
                                        {
                                            '_id': data._id,
                                            'ExpenseDetails.categoryObj._id': edit.ExpenseDetails[k].categoryObj._id,
                                        },
                                        {
                                            $set: {
                                                [`ExpenseDetails.${k}.categoryObj.subCategory.${m}.amount`]: (expense.ExpenseDetails[j].categoryObj.subCategory[l].amount +
                                                    edit.ExpenseDetails[k].categoryObj.subCategory[m].amount),
                                                [`ExpenseDetails.${k}.categoryObj.subCategory.${m}.paymentMode`]: expense.ExpenseDetails[j].categoryObj.subCategory[l].paymentMode,
                                                [`ExpenseDetails.${k}.categoryObj.subCategory.${m}.details`]: (edit.ExpenseDetails[k].categoryObj.subCategory[m].details != null) ? edit.ExpenseDetails[k].categoryObj.subCategory[m].details.concat(
                                                    expense.ExpenseDetails[j].categoryObj.subCategory[l]) : expense.ExpenseDetails[j].categoryObj.subCategory[l]
                                            }
                                        },
                                        { new: true }, function (err, Update1) {
                                            if (err) {
                                                console.log('-- 2 err', err)
                                                rejecte(err);
                                            }
                                            // console.log('--Update1',Update1.ExpenseDetails[0].categoryObj.subCategory[0]);
                                            
                                        })
                                }else{
                                    if (m === edit.ExpenseDetails[k].categoryObj.subCategory.length - 1 &&  subFlag == false) {
                                        newCategory = newCategory.concat(expense.ExpenseDetails[j].categoryObj.subCategory[l])
                                        let newSub = {
                                            newCategory:newCategory,
                                            catIndex :k
                                        }
                                        newSubData= newSubData.concat(newSub)
                                        newCategory = []
                                    }
                                }
                                
                            }
                        }
                        
                    } else {
                        if( k === edit.ExpenseDetails.length-1 &&  catFlag ==  false){
                            // console.log('--- elseeeee',edit.ExpenseDetails[k].categoryObj._id);
                                uncommonCat = uncommonCat.concat(expense.ExpenseDetails[j])
                        }
                    }
                    // console.log('--- last berfore',expense.ExpenseDetails[j].categoryObj._id,edit.ExpenseDetails[k].categoryObj._id );
                    
                }
                // console.log('---in last for expense.ExpenseDetails[j].categoryObj._id',expense.ExpenseDetails[j].categoryObj._id);

                if (j === expense.ExpenseDetails.length - 1) {
                    let commonData= {
                        commonCat: commonCat,
                        uncommonCat: uncommonCat,
                        _id: data._id,
                        newSubData:newSubData
                    }
                    resolve(commonData)
                }
    
            }
        }else{
            Expense.create(expense, function (err, expenseDoc) {
                // console.log('---created');
    
                if (err) {console.log('err', err); reject( err )}
    
                else {
                    for (var n = 0; n < expenseDoc.ExpenseDetails.length; n++) {
                        for (var o = 0; o < expense.ExpenseDetails[n].categoryObj.subCategory.length; o++) {
                            // console.log('n m', n, o);
    
                            Expense.findOneAndUpdate(
                                {
                                    '_id': expenseDoc._id,
                                    'ExpenseDetails.categoryObj._id': expenseDoc.ExpenseDetails[n].categoryObj._id,
                                },
                                {
                                    $set: {
                                        [`ExpenseDetails.${n}.categoryObj.subCategory.${o}.details`]: expense.ExpenseDetails[n].categoryObj.subCategory[o]
                                    }
                                },
                                { new: true }, function (err, Update) {
                                    if (err) console.log('--err', err);
                                    // console.log('n m', n, o);
                                    resolve(Update)
    
    
                                })
                        }
    
                    }
    
                    // return(expenseDoc)
                    // res.json({success: true, error: false, message: 'expense Added',data: expenseDoc})
                }
            })
        }
       
    })
}

function AddUncommonCat(data , edit ,expense,flag){
    // Straight forward push
    return new Promise(function(resolve, reject) {
        if(flag){
            Expense.findOneAndUpdate(
                {
                    '_id': data._id,
                },
                {
                    $push: {

                        [`ExpenseDetails`]:data.uncommonCat,
                    }
                },
                { new: true }, function (err, Update) {
                    // console.log('---here 4', Update.ExpenseDetails[0].categoryObj.subCategory[0]);
                    if (err) reject(err)
                    else{
                        resolve(Update)
                    }

            })
        }else{
            resolve(data)
        }
    })
}

function UncommonSubcat(data , edit,flag){
    return new Promise(function(resolve, reject) {
        // Check by subcategory name, find indexes of subcategory and update
    // Matching subcategories - Push into new array = [{ subcat: {}, catInd: 1, subCatInd: 0 }, { subcat:{}, index: 4 }]
    // Non - matching subcategories - Push into new array
    // console.log('---data',data ,flag);
    if(flag){
        // console.log('--- here ',data.newSubData.length);
        if(data.newSubData.length > 0){
        for(var newSub = 0 ;newSub < data.newSubData.length ; newSub ++){
            // console.log('--- here Update2');
            Expense.findOneAndUpdate(
                {
                    '_id': data._id,
                    'ExpenseDetails.categoryObj._id': edit.ExpenseDetails[data.newSubData[newSub].catIndex].categoryObj._id,
                },
                {
                    $push: {
                        [`ExpenseDetails.${data.newSubData[newSub].catIndex}.categoryObj.subCategory`]:data.newSubData[newSub].newCategory,
                    }
                },
                { new: true }, function (err, Update2) {
                    // newSubCat = Update2
                    if (err) {
                        console.log('err here 1 ', err);
                        reject(err)
                    }
                    else {
                        // console.log('---Update2',Update2.ExpenseDetails[0].categoryObj.subCategory.length,newSub,data.newSubData.length );
                        if(newSub === data.newSubData.length ){
                            // console.log('----here Update2',Update2.ExpenseDetails[0].categoryObj.subCategory.length);
                            for (var k = 0; k < Update2.ExpenseDetails.length; k++) {
                                // console.log('--here in Update2 details 2 ')
                                for (var m = 0; m < Update2.ExpenseDetails[k].categoryObj.subCategory.length; m++) {
                                    // console.log('--here in  Update2details 3',Update2.ExpenseDetails[0].categoryObj.subCategory[5])
                                    if(Update2.ExpenseDetails[k].categoryObj.subCategory[m].details.length === 0 ){
                                        // console.log('--here in Update2 details 4',Update2.ExpenseDetails[0].categoryObj.subCategory[5]);
                                        
                                        Expense.findOneAndUpdate(
                                            {
                                                '_id': data._id,    
                                                'ExpenseDetails.categoryObj._id': Update2.ExpenseDetails[k].categoryObj._id,
                                            },
                                            {
                                                $set: {
                                                    [`ExpenseDetails.${k}.categoryObj.subCategory.${m}.details.${0}.amount`]: Update2.ExpenseDetails[k].categoryObj.subCategory[m].amount,
                                                    [`ExpenseDetails.${k}.categoryObj.subCategory.${m}.details.${0}.paymentMode`]: Update2.ExpenseDetails[k].categoryObj.subCategory[m].paymentMode
                                                }
                                            },
                                            { new: true }, function (err, Update3) {
                                                if (err) {
                                                    console.log('---erre', err);
                                                    reject(err)
                                                }else{
                                                    // console.log('-------------details Update2 upadte');
                                                    
                                                    resolve(Update3)
                                                }   
                            
                                            })
                                    }
                                    
                                }
                            }
                         resolve(Update2)
                        }
                    }
    
                })
        }
    }else{
        // console.log('--- else UncommonSubcat');

        resolve(data)
    }
    }else{
        // console.log('--- else 1  UncommonSubcat');

        resolve(data)
    }
    
   
    })
}

function detailsUpdate (edit,data,resUncommonSubcat,flag){
    return new Promise(function(resolve, reject) {
        // console.log('---here in details 1',resUncommonSubcat.ExpenseDetails[0].categoryObj.subCategory.length)
    if(resUncommonSubcat.ExpenseDetails && flag){
        for (var k = 0; k < resUncommonSubcat.ExpenseDetails.length; k++) {
            // console.log('--here in details 2 ')
            for (var m = 0; m < resUncommonSubcat.ExpenseDetails[k].categoryObj.subCategory.length; m++) {
                // console.log('--here in details 3',edit.ExpenseDetails[0].categoryObj.subCategory[5])
                if(resUncommonSubcat.ExpenseDetails[k].categoryObj.subCategory[m].details.length === 0 ){
                    // console.log('--here in details 4',resUncommonSubcat.ExpenseDetails[0].categoryObj.subCategory[5]);
                    
                    Expense.findOneAndUpdate(
                        {
                            '_id': data._id,    
                            'ExpenseDetails.categoryObj._id': resUncommonSubcat.ExpenseDetails[k].categoryObj._id,
                        },
                        {
                            $set: {
                                [`ExpenseDetails.${k}.categoryObj.subCategory.${m}.details.${0}.amount`]: resUncommonSubcat.ExpenseDetails[k].categoryObj.subCategory[m].amount,
                                [`ExpenseDetails.${k}.categoryObj.subCategory.${m}.details.${0}.paymentMode`]: resUncommonSubcat.ExpenseDetails[k].categoryObj.subCategory[m].paymentMode
                            }
                        },
                        { new: true }, function (err, Update3) {
                            if (err) {
                                console.log('---erre', err);
                                reject(err)
                            }else{
                                // console.log('-------------details upadte');
                                
                                resolve(Update3)
                            }   
        
                        })
                }
                
            }
        }
    }else{
        resolve(edit)
    }
})
                    
}
module.exports.addSubCategory = function (req, res, next) {
    let addCategoryId = req.params.id
    Category.findById(addCategoryId, function (err, getSubCategory) {
        if (err) return handleError(err, req, res, next)
        else
            // console.log('----getSubCategory',getSubCategory.categoryObj.subCategory.name);

            res.json({ success: true, error: false, message: 'category ' + addCategoryId + '  updated', data: getSubCategory })

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

module.exports.updateExpense = function (req, res, next) {
    let _id = req.params.id
    let expense = req.body
    Expense.findById(_id, function (err, expenseUpdate) {
        if (err) return handleError(err, req, res, next)
        let update = expenseUpdate.ExpenseDetails.push(expense.ExpenseDetails[0])
        Expense.findByIdAndUpdate(_id, expenseUpdate, { new: true }, function (err, Update) {
            if (err) return handleError(err, req, res, next)
            else
                res.json({ success: true, error: false, message: 'expense ' + _id + '  updated', data: Update })

        })
    })
}

module.exports.getAllExpense = function (req, res, next) {
    let _filter = req.query.filter
    let allExpense = {}

    if (_filter) {
        allExpense = JSON.parse(_filter)
    }
    Expense.find(allExpense).exec(function (err, allExpenseDoc) {
        if (err) return handleError(err, req, res, next)

        res.json({ error: false, success: true, message: '', data: allExpenseDoc })
    })

}

module.exports.notAciveExpense = function (req, res, next) {
    let _id = req.params.id
    Expense.updateOne({ _id }, { isActive: false }, function (err, deletedDoc) {
        if (err) return handleError(err, res, req, next)
        else
            res.json({ success: true, error: false, message: 'user ' + _id + ' is deleted', data: deletedDoc })
    })



}
module.exports.editOneCatExpense = function (req, res, next) {
    let expenseCat = req.body
    let _id =(req.params.id)
    console.log('---- in else part of editOneCatExpense ');
        Expense.findOne({ '_id':expenseCat._id, 'isActive': true,'createdBy._id':req.session.userInfo._id}, function (err, expenseByIdDoc) {
            if (err) return handleError(err, req, res, next)
            // console.log('expenseCat',expenseCat,);
            
            let docModified = JSON.parse(JSON.stringify(expenseByIdDoc))
            // console.log('-- before editCategory',docModified.ExpenseDetails[0].categoryObj.subCategory[0]);
            
            // let activeCat = []
            let editCategory
            expenseByIdDoc.ExpenseDetails.forEach((subCat, indexSub) => {
                // let isActivSubCat = []
                // console.log('---subCat',( expenseCat.categoryObj._id._id) === ( subCat.categoryObj._id));
                let count = 0
                if (( expenseCat.categoryObj._id._id) === ( subCat.categoryObj._id)) {
                    // expenseByIdDoc
                    docModified.ExpenseDetails[indexSub].categoryObj.subCategory =expenseCat.categoryObj.subCategory
                    expenseCat.categoryObj.subCategory.forEach((amount,i)=>{
                        // console.log('--amount',amount);                    
                        amount.details.forEach((addAmount , addAmountIndex)=>{                        
                            count = count + addAmount.amount
                            // console.log('--count',count,addAmountIndex,amount.details.length);                        
                            if(addAmountIndex === amount.details.length-1 ){
                                // console.log('--- herererer---000');
                                
                                docModified.ExpenseDetails[indexSub].categoryObj.subCategory[i].amount = count
                                count = 0
                            }

                        })
                    })
                    // console.log('-- heree docModified',docModified.ExpenseDetails[indexSub].categoryObj.subCategory[0]);

                }
            })
        Expense.update({'_id':expenseCat._id}, {'ExpenseDetails':docModified.ExpenseDetails}, function (err, updatedExpense) {
            if (err) return handleError(err, req, res, next)
            res.json({ error: false, success: true, message: '', data: updatedExpense })


        })
            
    })   
}
module.exports.getOneExpense = function (req, res, next) {
    let expenseCat = req.body
    let _id =(req.params.id)
    // console.log('-- in getoneexpense req.session',req.session.userInfo._id,_id);
    
    Expense.findOne({ '_id':_id, 'isActive': true,'createdBy._id':req.session.userInfo._id}, function (err, expenseByIdDoc) {
        if (err) return handleError(err, req, res, next)
        // console.log('expenseCat',expenseCat,expenseByIdDoc);
        
        // let activeCat = []
        let editCategory
        expenseByIdDoc.ExpenseDetails.forEach((subCat, indexSub) => {
            // let isActivSubCat = []
            // console.log('---subCat',( expenseCat.categoryId) ,( subCat._id.toString()));
            
            if (( expenseCat.categoryId) === ( subCat._id.toString())) {
                editCategory = subCat
            }
        })
        // console.log('--editCategory',editCategory);
        
        let obj = {
            _id: expenseByIdDoc._id,
            category: editCategory._id,
            subCategory: editCategory.categoryObj.subCategory,
            createdAt: expenseByIdDoc.createdAt,
            updatedAt: expenseByIdDoc.updatedAt,
            isActive: expenseByIdDoc.isActive,
            createdBy:expenseByIdDoc.createdBy,
            expenseDate:expenseByIdDoc.expenseDate
        }
        // activeCat = activeCat.concat(obj)

        // console.log('---obj', obj);

        res.json({ error: false, success: true, message: '', data: obj })
    })

}
module.exports.deleteExpense = function (req, res, next) {
    let _id = req.params.id
    let expense = req.body
    // console.log('expense', expense);

    Expense.findOne({ _id }).exec(function (err, doc) {

        console.log('details', doc.expenseOn[1]._id.toString(),
            doc.expenseOn[0]._id, expense, expense._id)
        let index = doc.expenseOn.map(function (e) {
            return e._id.toString()
        }).indexOf(expense._id.toString())

        // console.log('index', index)

        Expense.findOneAndUpdate({ '_id': _id, 'expenseOn._id': expense._id },
            {
                $set: { [`expenseOn.${index}.isActive`]: false },
            }, { new: true }, (err, deletedexpenseDoc) => {
                if (err) return handleError(err, res, req, next)
                else
                    res.json({ success: true, error: false, message: 'user ' + expense.subCategory + ' is deleted', data: deletedexpenseDoc })
            })
    })


}
module.exports.report = function (req, res, next) {
    let expense = req.body
    Expense.find({}).populate({path:'ExpenseDetails.categoryObj._id'}).sort({expenseDate:-1}).exec( (err, doc) => {
        if (err) return handleError(err, res, req, next)
        let i = []
        if (expense.startDate) {
            doc.forEach(function (ele, index) {
                // console.log('ele.expenseDate', ele.expenseDate, new Date(new Date(expense.startDate).setHours(0, 0, 0, 0)), (new Date(expense.startDate).setHours(0, 0, 0, 0)), new Date(new Date(expense.endDate).setHours(0, 0, 0, 0)));
                let dateObj = new Date(ele.expenseDate).setMinutes(new Date(ele.expenseDate).getMinutes() + 330) >= new Date(new Date(expense.startDate).setUTCHours(0, 0, 0, 0))
                    && new Date(ele.expenseDate).setMinutes(new Date(ele.expenseDate).getMinutes() + 330) <= new Date(new Date(expense.endDate).setUTCHours(23, 59, 59, 999))
                // console.log('dateObj', dateObj);
                if (dateObj) {
                    i = i.concat(ele)
                }
            })
            if(expense.categoryName){
                let selectedCategory =[]
            //    console.log('--expense.categoryName',expense.categoryName,i.length);
                i.forEach((expenses,indexExpense)=>{
                    // console.log('--expense',i.length,indexExpense);
                    let catFlag = false
                    expenses.ExpenseDetails.forEach((category,categoryIndex)=>{
                        // console.log('--category',expense.categoryName,category.categoryObj._id.category,category.categoryObj._id.category== expense.categoryName);
                        
                        // console.log('--indexExpense',indexExpense);
                        // i[indexExpense].ExpenseDetails = []
                        if(category.categoryObj._id.category == expense.categoryName){                            
                            // selectedCategory=selectedCategory.concat(category) 
                            catFlag = true                           
                            i[indexExpense].ExpenseDetails[0]=category
                            // console.log('--i',i[indexExpense].ExpenseDetails[0] ,i[indexExpense]._id);
                            
                        }
                        if(!catFlag){
                            i[indexExpense].ExpenseDetails = []
                        }
                    })   
                    if(indexExpense === i.length -1 ){
                        // console.log('--I -- INDEX',i);
                        
                        var filteredOutUndefined = i.filter(function (el) {
                            // console.log('===',el.ExpenseDetails.length ,el.ExpenseDetails);
                            
                            return el.ExpenseDetails.length > 0;
                            });
                        res.json({ success: true, error: false, message: 'expense  data', data: filteredOutUndefined})
                    }           
                
                })
                // console.log('--i',i);
                
            }else{
                // console.log('in else')
                res.json({ success: true, error: false, message: 'expense  data', data: i })
            }
        }
    })
}
module.exports.setNotActiveExpense = function (req, res, next) {
    let _id = req.params.id
    let expense = req.body
    // console.log('expense', expense);
    Expense.findOne({ _id }).exec(function (err, doc) {
        let index = doc.expenseOn.subCategory.map(function (e) {
            return e._id.toString()
        }).indexOf(expense._id.toString())

        // console.log('index', index)

        Expense.findOneAndUpdate({ '_id': _id, 'expenseOn._id': expense._id },
            {
                $set: { [`expenseOn.${index}.isActive`]: false },
            }, { new: true }, (err, deletedexpenseDoc) => {
                if (err) return handleError(err, res, req, next)
                else
                    res.json({ success: true, error: false, message: 'user ' + expense.subCategory + ' is deleted', data: deletedexpenseDoc })
            })
    })


}
module.exports.setNotActiveSubCat = function (req, res, next) {
    let _id = req.params.id
    let expense = req.body
    // console.log('expense', expense);
    Expense.findOne({ _id }).exec(function (err, doc) {
        let index = doc.expenseOn.subCategory.map(function (e) {
            return e._id.toString()
        }).indexOf(expense._id.toString())

        // console.log('index', index)

        Expense.findOneAndUpdate({ '_id': _id, 'expenseOn._id': expense._id },
            {
                $set: { [`expenseOn.${index}.isActive`]: false },
            }, { new: true }, (err, deletedexpenseDoc) => {
                if (err) return handleError(err, res, req, next)
                else
                    res.json({ success: true, error: false, message: 'user ' + expense.subCategory + ' is deleted', data: deletedexpenseDoc })
            })
    })


}

module.exports.dateWiseReport = (req,res,next)=>{
    console.log('--here');
    
    let expense = req.body
    let catAmount = []
    x = 9
    // console.log('--a',x);
    
    console.log('--expense.flag',expense);
    // new Date(ele.endDate).setMinutes(new Date(ele.endDate).getMinutes() + 330)
    if(expense.flag =='month'){
     // THE DATE OBJECT.
    var dt = new Date(expense.value);
    // console.log('--day',new Date());
    
    // var month = dt.getMonth(),
    // year = dt.getFullYear();

    // GET THE MONTH AND YEAR OF THE SELECTED DATE.
    var month =expense.month,
    year = expense.year
    // console.log('--- month',month);
    // console.log('--- year',year);

    // GET THE FIRST AND LAST DATE OF THE MONTH.
    let FirstDay = new Date(year, month-1, 2 );
    let LastDay = new Date(year, month );
    // console.log('--- FirstDay',FirstDay);
    // console.log('--- LastDay',LastDay);
    expense.startDate = FirstDay
    expense.endDate = LastDay
    }
    if(expense.flag =='day'){
        expense.startDate = expense.value
        expense.endDate = expense.value
        console.log('--expense.value',expense.value);
        
        
    }
    if(expense.flag =='year'){
        var year = expense.year //Any Year
        
        // GET THE FIRST AND LAST DATE OF THE YEAR.
        let FirstDay = new Date(year, 0, 2);
        let LastDay = new Date(year, 11, 32);
        console.log('-FirstDay',FirstDay);
        console.log('-LastDay',LastDay);                     
        expense.startDate = FirstDay
        expense.endDate = LastDay
        // console.log('---new startDate',new Date(expense.startDate).setUTCHours(0, 0, 0, 0));
        // console.log('--new endDate', new Date(expense.endDate).setUTCHours(23, 59, 59, 999));
    }
    Expense.find({}).populate({path:'ExpenseDetails.categoryObj._id',select:'category'}).exec( (err, doc) => {
        if (err) return handleError(err, res, req, next)
        let i = []
            doc.forEach(function (ele, index) {
                let startDate = new Date(expense.startDate).setMinutes(new Date(ele.startDate).getMinutes() + 330)
                let endDate = new Date(expense.endDate).setMinutes(new Date(ele.endDate).getMinutes() + 330)
                // let dateObj = new Date(ele.expenseDate)>= new Date(expense.startDate).setMinutes(new Date(expense.startDate).getMinutes() + 330)
                // &&  new Date(ele.expenseDate) <= new Date(expense.endDate).setMinutes(new Date(expense.endDate).getMinutes() + 330)
                let dateObj = new Date(ele.expenseDate)>= new Date(new Date(expense.startDate).setHours(0, 0, 0, 0))
                &&  new Date(ele.expenseDate) <= new Date(new Date(expense.endDate).setHours(23, 59, 59, 999))
            if (dateObj) {
                i = i.concat(ele)
            }
            if (index === doc.length - 1) {
                console.log('--i',i);
                
                i.forEach((ele,docIndex)=>{
                    ele.ExpenseDetails.forEach((ExpenseDetails,ExpenseDetailsIndex)=>{
                        let subCategoryAmount = 0
                        ExpenseDetails.categoryObj.subCategory.forEach((subCategory,subCategoryIndex)=>{
                            if(subCategory.amount){
                                subCategoryAmount = subCategoryAmount+subCategory.amount
                            }
                        })
                        let data = {
                            name:ExpenseDetails.categoryObj._id.category ,
                            y:subCategoryAmount
                        }
                        let exist =catAmount.filter(f => f.name===ExpenseDetails.categoryObj._id.category );
                        // console.log('--exist',exist.length ,exist,ExpenseDetails.categoryObj._id.category);
                        
                        if(exist.length == 0){

                            catAmount = catAmount.concat(data)
                        }else{
                            let index =catAmount.map((e)=>{
                                return e.name
                            }).indexOf(ExpenseDetails.categoryObj._id.category)
                            
                            catAmount[index].y = catAmount[index].y + subCategoryAmount
                            
                        }
                    })
                })
            }
        })
        // console.log('i.length',i.length,catAmount);        
        res.json({ success: true, error: false, message: 'expense  data', data: catAmount })
    })
}

module.exports.categoryFilter = (req,res,next)=>{
    let expense = req.body
    let catAmount = []
    // let modifiedExpense = JSON.parse(JSON.stringify(expense))
    expense.startDate = ''
        expense.endDate = ''
    console.log('--expense.flag',expense);
   
    Expense.find({}).populate({path:'ExpenseDetails.categoryObj._id',select:'category'}).exec( (err, doc) => {
        if (err) return handleError(err, res, req, next)
        let i = []
            doc.forEach(function (ele, index) {
                let dateObj = new Date(ele.expenseDate).setMinutes(new Date(ele.expenseDate).getMinutes() + 330)>= new Date(expense.startDate).setUTCHours(0, 0, 0, 0)
                &&  new Date(ele.expenseDate).setMinutes(new Date(ele.expenseDate).getMinutes() + 330) <= new Date(expense.endDate).setUTCHours(23, 59, 59, 999)
            if (dateObj) {
                i = i.concat(ele)
            }
            if (index === doc.length - 1) {
                i.forEach((ele,docIndex)=>{
                    
                })
            }
        })
        // console.log('i.length',i.length,catAmount);        
        res.json({ success: true, error: false, message: 'expense  data', data: catAmount })
    })
}