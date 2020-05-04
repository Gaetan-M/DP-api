const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Personnel = require('../models/personnel.model');

const sendMail = (req, res) => {
  function GenerateCode() {
    return Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
  }

  Personnel.findOne({email:req.body.email})
    .then(user=>{
      if(user){
        const code = GenerateCode()
        let hashCode = bcrypt.hashSync(String(code),10);

        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.SRC_EMAIL,
            pass: process.env.SRC_PWD
          }
        });

        var mailOptions = {
          from: `"eSchool Learning" ${process.env.SRC_EMAIL}`,
          to: req.body.email,
          subject: 'Comfirmation Code - Reset Password',
          html: `<div>
                    <h1>Comfirmation Code</h1>
                    <br/>
                    <h3><b>${code}</b></h3>
                  </div>`
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
            res.status(400).json({ error: error.message })
          } else {
            console.log('Email sent: ' + info.response,hashCode);
            let token = jwt.sign({ id: user._id, code: hashCode }, process.env.JWT_KEY, {
              expiresIn: 86400
            });
            console.log(token)
            res.status(200).json({ message: token })
          }
        });
      }
      else {
        res.status(404).json({message: "Email not found"})
      }
    })
    .catch(err => res.status(500).json({error: err.message}))
}




module.exports = sendMail