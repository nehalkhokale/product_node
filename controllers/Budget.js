const Expense = require('../models/Expense')
const User = require('../models/User')
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
            var month =expense.month,
            year = expense.year
            
            // GET THE FIRST AND LAST DATE OF THE MONTH.
            let FirstDay = new Date(year, month-1, 2 );
            let LastDay = new Date(year, month );
            expense.startDate = FirstDay
            expense.endDate = LastDay
        }else if(expense.flag =='year'){
            var year = expense.year //Any Year
            
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
    let createdBy = {
        _id: _userInfo._id,
        email: _userInfo.email ? _userInfo.email : null,
        name: _userInfo.name ? _userInfo.name : null,
        org: _userInfo.org ? _userInfo.org : null,
        mobile: _userInfo.mobile ? _userInfo.mobile : null,
    }      
   let a =  await totalSpanAmount(expense)
   User.findOne({'_id': createdBy._id},(err,userBudget)=>{
    if(userBudget.budget.value >= totalSpanAmount- 10){
        console.log('You are nearing to your budget')
    }else{
        console.log('You have exceeded your budget');
        
    }

   })
}
