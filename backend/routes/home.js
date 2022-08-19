const express = require('express')
const userController = require('../controllers/home')
const authorizationController = require('../authorization/autorrization')
const homeController = require('../controllers/home')
const orderController = require('../controllers/order')

const router = express.Router()

router.get('/home', authorizationController.authenticateToken, homeController.getUserDetails)
router.post('/home/addExpense', authorizationController.authenticateToken, homeController.postExpense)
router.get('/home/getExpenses',authorizationController.authenticateToken, homeController.getAllExpenses)
router.get('/home/purchasePremium', authorizationController.authenticateToken, orderController.purchasepremium)
router.post('/home/updateTransactionStatus', authorizationController.authenticateToken, orderController.updateTransactionStatus)
router.get('/home/leaderboard', authorizationController.authenticateToken, homeController.getExpenseTotals)
router.post('/home/deleteExpense', authorizationController.authenticateToken, homeController.postDeleteExpense)
router.get('/home/report/getDailyExpenses', authorizationController.authenticateToken, homeController.getDailyExpenses)
router.get('/home/report/getWeeklyExpenses', authorizationController.authenticateToken, homeController.getWeeklyExpenses)
router.get('/home/report/getMonthlyExpenses', authorizationController.authenticateToken, homeController.getMonthlyExpenses)
router.get('/home/report/download', authorizationController.authenticateToken, homeController.downloadExpenseList)

module.exports = router