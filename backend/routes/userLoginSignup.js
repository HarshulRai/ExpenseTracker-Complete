const express = require('express')
const userController = require('../controllers/user')
const { route } = require('./home')

const router = express.Router()


router.post('/signup', userController.postSignup)

router.post('/login', userController.postLogin)




module.exports = router