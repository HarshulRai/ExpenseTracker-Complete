
const sgMail = require("@sendgrid/mail");
const ForgetPassword = require("../models/forgotPassword");
const User = require("../models/user");



const uuid = require("uuid");

const bcrypt = require("bcrypt");

exports.forgotPassword = async (req, res) => {
  var email = req.body.email;

  //console.log(email)

  await User.findOne({ where: { email: email } })
    .then((user) => {
      if (user) {
        const id = uuid.v4();
        user.createForgotpassword({ id, active: true })
          .catch((err) => {
            throw new Error(err);
          });
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
          to: email, 
          from: "harshuljps@gmail.com", 
          subject: "Forgot password",
          text: "and easy to do anywhere, even with Node.js",
          html: `<a href="http://localhost:3000/resetpassword/${id}">Reset password</a>`,
        }

        sgMail
          .send(msg)
          .then((response) => {
            return res
              .status(response[0].statusCode)
              .json({
                message: "Link to reset your password have sent to your mail ",
                sucess: true,
              });
          })
          .catch((error) => {
           res.status(401).json(error)
          })
       
      } else {
        
        res.status(404).json("User doesnt exist")
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(401).json(err)
    })
}

exports.resetPassword=(req,res)=>{
   const id=req.params.id

   ForgetPassword.findOne({where:{id:id}}).then(forgotPassword=>{
     if(forgotPassword){

       //console.log(forgotPassword.active)
       if(!forgotPassword.active){
        res.status(200).send(
          `
          <html>
          <h1> link is expired
          </html>`
        )

       }
      forgotPassword.update({active:false});
      res.status(200).send(`<html>
      <script>
          function formsubmitted(e){
              e.preventDefault();
              console.log('called')
          }
      </script>
      <body>
      <form action="/updatepassword/${id}" method="get">
          <label for="newpassword">Enter New password</label>
          <input name="newpassword" type="password" required></input>
          <button>reset password</button>
      </form>
      </body>
  </html>`
  ) 
   res.end()
     }
     else{
      
     }
   })

}

exports.updatePassword=(req,res)=>{
  const newpassword=req.query.newpassword;
  //console.log(req.body)
  const id=req.params.id

  ForgetPassword.findOne({where:{id}}).then(forgotpassword=>{
    // console.log(forgotpassword.userId)
    User.findOne({where:{id:forgotpassword.userId}}).then(async(user)=>{
      // console.log(user)
      if(user){
        const saltRounds=10;
        bcrypt.hash(newpassword, saltRounds, function (err, hash) {
          
          
          //console.log(hash)
          user.update({
              password: hash
             
            })
              .then(() => {
                res.status(200).send(
                  `
                  <html>
                  <h1> password changed sucessfully</h1>
                  </html>`
                )
              }
              )
              .catch((err) => {
                console.log(err);
               
              });
        });
      }
      else{
        res.json({msg:"user doesnt exists"})
      }
    })
  })
  .catch(err=>{
    console.log(err)
  })


}