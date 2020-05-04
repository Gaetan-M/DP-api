const jwt = require('jsonwebtoken'); 

const auth = (req, res, next) => {
  try {
    const token = req.headers['x-access-token'];
  
    if (!token)
      return res.status(403).send({ auth: false, message: 'No token provided' });
  
    jwt.verify(token, process.env.JWT_KEY, function (err, decoded) {
      if (err)
        return res.status(500).send({ auth: false, message: 'Failed to authenticate token' });
  
      req.userId = decoded.user._id;
      req.role = decoded.user.role;
      next();
    });
  } catch (error) {
    res.status(500).json({error:error})
  }

}

module.exports = auth;