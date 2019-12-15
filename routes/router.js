const express = require('express')
const router = new express.Router()
const constants = require('../constants/constants')
const User= require('../controllers/User')
const Category = require('../controllers/Category')
const Roles = require('../controllers/Role')
const Expense = require('../controllers/Expense')
// check default route
router.get('/', (req, res) => {
    res.json({
        message: constants.WELCOME_MSG,
    })
})


//Users 
router.post('/user/register', User.register)
router.post('/user/login', User.login)
router.get('/v1/auth/me', User.me)

//Protected routes 
// router.use(User.verifyToken)

router.post('/user/changepassword', User.changePassword)
router.post('/createuser', User.create)
router.put('/updateuser/:id', User.update)
router.get('/userbyid/:id',User.getOne)
router.get('/userlist', User.getAllUser)
router.put('/deleteuser/:id', User.notAciveUser)
router.delete('/user/:id', User.deleteUser)


//Category 
router.post('/createCategory', Category.createCategory)
// router.put('/updateCategory/:id', Category.updateCategory)
router.put('/updateCategory/:id',Category.subCategoryUpdate)
router.get('/categorybyid/:id', Category.getOne)
router.get('/categorylist', Category.getAllCategory)
router.put('/deletecategory/:id', Category.notAciveCategory)
router.delete('/category/:id', Category.deleteCategory)

//Expense
router.post('/expense', Expense.createExpense)
router.put('/expense/:id', Expense.updateExpense)
router.get('/expense', Expense.getAllExpense)
router.get('/expense/getsubcategory/:id',Expense.addSubCategory)
router.delete('/expense/expensenotactive/:id', Expense.notAciveExpense)
router.delete('/expense/:id', Expense.deleteExpense)
router.delete('/expense/subcatnotactive/:id', Expense.setNotActiveSubCat)
router.post('/getreport', Expense.report)

//Role
router.post('/createrole', Roles.create)
router.put('/updaterole/:id', Roles.update)
router.get('/rolebyid/:id',Roles.getOne)
router.get('/rolelist', Roles.getAllUser)
router.put('/deleterole/:id', Roles.notAciveUser)
router.delete('/role/:id', Roles.deleteUser)
module.exports = router
