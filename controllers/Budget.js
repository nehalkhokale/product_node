const Expense = require('../models/Expense')
const User = require('../models/User')
const Email = require('../models/Email')
const App = require('../models/App')
const MyEmmiter = require('../utility/EventCore')


handleError = function (err, req, res, next) {
    res.status(500).send({ success: false, error: true, message: `${err.message}` })
}
// const Nexmo = require('nexmo');
// const nexmo = new Nexmo({
//   apiKey: API_KEY,
//   apiSecret: API_SECRET,
// }, {debug: true});
// module.exports.totalSpanAmount = (req,res,next)=>{
function totalSpanAmount (expenses){
    return new Promise( (resolve,reject)=>{
        let expense = expenses
        console.log('--expense here',expense);
                    
        var subCategoryAmount = 0;
        if(expense.flag =='month'){
            // GET THE MONTH AND YEAR OF THE SELECTED DATE.
            var month =(new Date()).getMonth() ,
            year = (new Date()).getFullYear()
            console.log('--month',month);
            console.log('--year',year);
            
            // GET THE FIRST AND LAST DATE OF THE MONTH.
            let FirstDay = new Date(year, month-1, 2 );
            let LastDay = new Date(year, month );
            expense.startDate = FirstDay
            expense.endDate = LastDay
        }else if(expense.flag =='year'){
            var year = (new Date()).getFullYear() //Any Year
            
            // GET THE FIRST AND LAST DATE OF THE YEAR.
            let FirstDay = new Date(year, 0, 2);
            let LastDay = new Date(year, 11, 32);                
            expense.startDate = FirstDay
            expense.endDate = LastDay
        }
        console.log('--here');
        
        Expense.find({}).populate({path:'ExpenseDetails.categoryObj._id',select:'category'}).exec( (err, doc) => {
            if (err) reject (err)
            let i = []
    
                doc.forEach(function (ele, index) {
                    let dateObj = new Date(ele.expenseDate)>= new Date(expense.startDate).setUTCHours(0, 0, 0, 0)
                    &&  new Date(ele.expenseDate) <= new Date(expense.endDate).setUTCHours(23, 59, 59, 999)
                if (dateObj) {
                    i = i.concat(ele)
                }
                
                if (index === doc.length - 1) {
                    i.forEach((ele,docIndex)=>{
                        ele.ExpenseDetails.forEach((ExpenseDetails,ExpenseDetailsIndex)=>{
                            
                            ExpenseDetails.categoryObj.subCategory.forEach((subCategory,subCategoryIndex)=>{
                                if(subCategory.amount){
                                    subCategoryAmount = subCategoryAmount+subCategory.amount
                                }
                            }) 
                            // console.log('--subCategoryAmount',subCategoryAmount);
                            
                        })
                    })
                }
            })
            resolve(subCategoryAmount)
        })
    })
   
}

module.exports.totalBudget =  async function (req,res,next){
    let expense = req.body  
    let _userInfo = req.session.userInfo   
    expense.flag =  _userInfo.budget.type
    let createdBy = {
        _id: _userInfo._id,
        email: _userInfo.email ? _userInfo.email : null,
        name: _userInfo.name ? _userInfo.name : null,
        org: _userInfo.org ? _userInfo.org : null,
        mobile: _userInfo.mobile ? _userInfo.mobile : null,
    }      
   let totalSpan=  await totalSpanAmount(expense)
   let resultFirstTrigger= (_userInfo.budget.firstTrigger/100)*_userInfo.budget.value
   let resultLastTrigger= (_userInfo.budget.lastTrigger/100)*_userInfo.budget.value
   var result
   var percent
   console.log('--resultFirstTrigger',resultFirstTrigger,_userInfo.budget.value);
   console.log('--resultLastTrigger',resultLastTrigger,totalSpan);
   
   if(totalSpan > resultLastTrigger){
       result = resultLastTrigger
       percent = _userInfo.budget.lastTrigger
    let emailData={
        to: [_userInfo.email],
        subject: 'test balance',
        content: 'You have exceeded your budget of' + percent,
        contentType: 'text/html',
    }
       sendMail(emailData)
       res.json({ success: true, error: false, message: 'You have exceeded your budget', data: 'You have exceeded your budget of' + percent })

   }else if ((totalSpan > resultFirstTrigger)){
     result = resultFirstTrigger
     percent = _userInfo.budget.firstTrigger
     res.json({ success: true, error: false, message: 'You have exceeded your budget', data: 'You have exceeded your budget of' + percent })
   }else{
        res.json({ success: true, error: false, message: 'users updated', data: 'You are in budget'})
    }

}
module.exports.createBudget =  function (req,res,next){
let budgetDetails = {
    budget: req.body.budget
}
let _id= req.body.id
User.findByIdAndUpdate(_id, budgetDetails, { new: true }, function (err, userUpdate) {
    if (err) { return handleError(err, req, res, next) }
    else {
        res.json({ success: true, error: false, message: 'users updated', data: userUpdate })
    }
})
}
module.exports.totalAmountSpent =  async function (req,res,next){
    let _userBudgetType = req.session.userInfo.budget.type 
    let _userBudgetValue = req.session.userInfo.budget.value    
    let expense = {}
    expense.flag =  _userBudgetType

    let totalSpan=  await totalSpanAmount(expense)
    let percentile= (totalSpan/_userBudgetValue)*100

    console.log('--_userBudgetType',_userBudgetType);
    console.log('--totalSpan',totalSpan);
    let object = {
        totalSpan:totalSpan,
        _userBudgetValue:_userBudgetValue,
        _userBudgetType:_userBudgetType,
        percentile:Math.round(percentile),
    }
    res.json({ success: true, error: false, message: 'users budget details', data: object })
    
}
function sendMail (mailObject){
    let _email = mailObject
    // let _appId = req.body.appId
    // _email = {
    //     to: ["nehal.khokale@ril.com"],
    //     subject: 'test balance',
    //     content: req.content,
    //     contentType: 'text/html',
    // }
    console.log('--_email',_email);
    
    App.find({}).exec().then((doc)=>{
        // if (!doc) return handleError({message: `${_appId} is not registered`}, req, res, next)
        let _app = doc[0]
        Email.create(_email, (err, doc)=>{
            // res.json({success: true, error: false, message: `${doc.status}`, data: {id: doc._id}})
            console.log('--doc',doc);
            console.log('--_app',_app);
            MyEmmiter.emit('sendMail', doc, _app)
        })
    }).catch((err)=>{
        return handleError(err, req, res, next)
    })
}

module.exports.sendEmail = (req, res, next) =>{
    let _email = req.body
    let _appId = req.body.appId
    _email = {
        to: ["nehal.khokale@ril.com"],
        subject: 'test balance',
        content: 'done ----',
        contentType: 'text/html',
    }
    App.find({}).exec().then((doc)=>{
        if (!doc) return handleError({message: `${_appId} is not registered`}, req, res, next)
        let _app = doc[0]
        Email.create(_email, (err, doc)=>{
            if (err) return handleError(err, req, res, next)
            // res.json({success: true, error: false, message: `${doc.status}`, data: {id: doc._id}})
            console.log('--doc',doc);
            console.log('--_app',_app);
            MyEmmiter.emit('sendMail', doc, _app)
        })
    }).catch((err)=>{
        return handleError(err, req, res, next)
    })
}
module.exports.createApp = function(req, res, next) {
    let _App = req.body
    let user = req.session.user || 'nobody'
    _App.createdBy = user
    App.create(_App, function(err, doc) {
        if (err) return handleError(err, req, res, next)
        res.json({error: false, success: true, message: '', data: doc})
    })
}