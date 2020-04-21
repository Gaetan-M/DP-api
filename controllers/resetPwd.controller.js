const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Personnel = require('../models/personnel.model');


const resetPassword = (req, res) => {
  
  const { id, password } = req.body;

  Personnel.findById(id)
  .then(user => { 
    if (!user) return res.status(404).json('user not found');

    const hash = bcrypt.hashSync(password,10);

    user.hash = hash;

    user.save()
    .then(user=>{
      res.status(200).json({message: "successfull reset"})
    })
    .catch(err =>{ console.log(err.message);res.status(500).json({ error: "failed to reset" })})
  })
  .catch(err =>{ console.log(err.message); res.status(404).json({error: "failed to reset"})})
};

module.exports = resetPassword;
