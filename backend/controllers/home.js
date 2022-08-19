const User = require('../models/user')
const Expense = require('../models/expense')
const Download = require('../models/download')
const Sequelize = require('sequelize')
const bcrypt = require('bcrypt');
const { json } = require('body-parser');
const saltRounds = 10;
const jwt = require('jsonwebtoken')
const Op = Sequelize.Op
const AWS = require('aws-sdk')

exports.postExpense = (req,res,next)=>{
    const expense = req.body.expense
    req.user.createExpense({
        amount: expense.amount,
        description: expense.description,
        category: expense.category
    })
    .then(result=>{
        res.status(200).json({result, msg: "Expense Added"})
    })
    .catch(err=>{
        console.log(err)
        res.status(402).json({msg: "Not added"})
    })
   
}

exports.getAllExpenses = (req, res, next)=>{
    req.user.getExpenses()
    .then(expenses=>{
        res.json({expenses})
    }).catch(err=>console.log(err))
}


exports.getUserDetails = (req, res, next)=>{
    let user = req.user.dataValues
    res.json({user})
}

exports.getExpenseTotals = async (req, res, next)=>{
    
    const totalAmount = await Expense.findAll({
        attributes: [
          'userId',
          [Sequelize.fn('sum', Sequelize.col('amount')), 'total_amount'],
        ],
        group: ['userId'],
        raw: true
      })

      
    totalAmount.sort((a,b)=> b.total_amount-a.total_amount)
    
    for(let i=0; i<totalAmount.length; i++){
        let user = await User.findAll({

            attributes:['name'],
            where: {id: totalAmount[i].userId}
        })

        //console.log(user[0].name)

        totalAmount[i] = {...totalAmount[i], name: user[0].name}
    }

    //console.log(totalAmount)
    res.json({totalAmount})
      
}

exports.postDeleteExpense = (req, res, next)=>{
    let expId = req.body.id

    Expense.destroy({where:{id:expId}})
    .then(()=>{
        res.send("Removed")
    }).catch(err=> console.log(err))
}

exports.getDailyExpenses = (req, res, next)=>{
    //console.log(req.user.id)
    const today = new Date().setHours(0,0,0,0)
    const now = new Date()

    req.user.getExpenses({
        where:{
            createdAt:{
                [Op.gt]: today,
                [Op.lt]: now
            }
        }
    })
    .then(result=>{
        //console.log(result)
        res.json(result)
    })
    
}

exports.getWeeklyExpenses = (req, res, next)=>{
    //console.log(req.user.id)
    const todayDate = new Date().getDate()
    const lastWeek  = new Date().setDate(todayDate-7)
    const now = new Date()
    
    req.user.getExpenses({
        where:{
            createdAt:{
                [Op.gt]: lastWeek,
                [Op.lt]: now
            }
        }
    })
    .then(result=>{
        //console.log(result)
        res.json(result)
    })
    
}

exports.getMonthlyExpenses = (req, res, next)=>{
    //console.log(req.user.id)
    const month = new Date().getMonth()
    const lastMonth  = new Date().setMonth(month-1)
    const now = new Date()
    
    req.user.getExpenses({
        where:{
            createdAt:{
                [Op.gt]: lastMonth,
                [Op.lt]: now
            }
        }
    })
    .then(result=>{
        //console.log(result)
        res.json(result)
    })
}

exports.downloadExpenseList = async(req, res, next)=>{
    
    const userId = req.user.id
    const expenses = await req.user.getExpenses()
    const stringifiedExp = JSON.stringify(expenses)
    const filename = `Expense${userId}/${new Date()}.txt`

    let s3Bucket = new AWS.S3({
        accessKeyId: process.env.IAM_USER_KEY,
        secretAccessKey:process.env.IAM_USER_SECRET,
    })

    let params = {
        Bucket: process.env.BUCKET_NAME,
        Key: filename,
        Body: stringifiedExp,
        ACL: 'public-read'
    }

    s3Bucket.upload(params, (err, s3Response)=>{
        if(err){
            console.log(err)
        }
        else{
            //console.log(s3Response)
            let fileURL = s3Response.Location
            req.user.createDownload({url: fileURL})
            res.status(200).json({fileURL, msg: 'Success'})
        }
    })
  
}