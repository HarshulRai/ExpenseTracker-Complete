require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')

const sequelize = require('./util/database')
const userRoutes = require('./routes/userLoginSignup')
const homeRoutes = require('./routes/home')
const forgotRoutes = require('./routes/forgot')
const User = require('./models/user')
const Expense = require('./models/expense')
const Order = require('./models/order')
const ForgetPassword = require('./models/forgotPassword')
const Download = require('./models/download')

const app = express()


app.use(cors())
app.use(bodyParser.json())

app.use(userRoutes)
app.use(homeRoutes)
app.use(forgotRoutes)

app.use((req, res)=>{
    //console.log('url: ', req.url)
    res.sendFile(path.join(__dirname, `../frontend/${req.url}`))
  })
  

User.hasMany(Expense)
Expense.belongsTo(User)

User.hasMany(Order)
Order.belongsTo(User)

User.hasMany(ForgetPassword)
ForgetPassword.belongsTo(User)

User.hasMany(Download)
Download.belongsTo(User)

sequelize.sync()
.then((res)=>{
    //console.log(res)
    app.listen(3000)
}).catch(err=>console.log(err))


