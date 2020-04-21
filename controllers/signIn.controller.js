const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Personnel = require('../models/personnel.model');

const signIn = (req,res) => {

  const { email, password } = req.body;

  Personnel.findOne({ email })
  .then(user => {
    if(!user) {
     return res.status(404).json({error: "User not found"});
    }
    let passwordIsValid = bcrypt.compareSync(password, user.hash);

    if (!passwordIsValid) return res.status(401).json({ message: {auth: false, token: null }});

    let token = jwt.sign({ user: user }, process.env.JWT_KEY, {
      expiresIn: 86400
    });
    res.status(200).json({ message: {auth: true, token: token }})
  })
  .catch(err => res.status(500).json({ error: err.message }))

};

module.exports = signIn;