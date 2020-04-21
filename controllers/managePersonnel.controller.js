const express = require('express');
const router = express.Router({ mergeParams: true });
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')

const auth = require('../middlewares/auth');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json())

const Personnel = require('../models/personnel.model');


router.get('/', auth ,function (req, res) {
  if (req.role !== "secretaire") res.status(502).json({ error: "auth failed" })
  Personnel.find({})
      .then(users => {
        res.status(200).json({message:users});
      })
      .catch(err => res.status(500).json({ error: err.message }))
});

router.post('/new', auth ,function (req, res) {
  
  const { matricule, email, prenom, nom, startDate, nomRole, tel } = req.body;

  bcrypt.hash("password1231", 10)
  .then(hash => {
    const User = new Personnel({
      hash,
      matricule,
      email,
      nom,
      prenom,
      tel,
      startDate,
      role: {
        nomRole,
        startDate
      }
    })
    User.save()
        .then(user => {
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'yourEmail@gmail.com',
              pass: 'password'
            }
          });

          const mailOptions = {
            from: 'yourEmail@gmail.com',
            to: email,
            subject: 'Your Password',
            html: `<div style="width: 100vw;height: 100vh;display: flex;flex-direction: column;align-items: center;justify-content: center;">
            <h1 style="font-weight: 300;">Password</h1>
            <span><b>${"password1231"}</b></span>
          </div>`
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
              res.status(400).json({ error: error })
            } else {
              console.log('Email sent: ' + info.response);
              res.status(200).json({ message: "password sent" })
            }
          });
          res.status(200).json({ message: `User ${user.nom} was created` })
        })
        .catch(err => res.status(500).json({ error: err.message }))
    })
    .catch(err => res.status(500).json({ error: err.message }))
});

router.get('/:id', auth ,function (req, res) {
  Personnel.findById(req.params.id)
      .then(user => {
        res.status(200).json({message:user});
      })
      .catch(err => res.status(500).json({ error: err.message }) )
});

router.delete('/:id/delete', auth ,function (req, res) {
  Personnel.findByIdAndRemove(req.params.id)
      .then(user => {
        res.status(200).json({ message: `User ${user.nom} was deleted`});
      })
      .catch(err => res.status(500).json({ error: err.message }))
});

router.put('/:id/update', auth ,async (req, res) => {
  const { id } = req.body;
  const oldUser = await Personnel.findById(id);
  oldUser.history.push({_id,matricule,nom,prenom,email,tel,startDate,role,changeDate: Date.now()})

  Personnel.findOneAndUpdate({id}, {...req.body, history: oldUser.history }, { new: true }) 
      .then(user => {
        res.status(200).json({message: `User ${user.nom} was updated`});
      })
      .catch(err => res.status(500).json({ error: err.message }))
});

module.exports = router;