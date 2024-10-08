const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if(!authHeader) {
        req.isAuth  = false;
        return next();
    }
    
    const token = authHeader.split(' ')[1] 
    // split is to split between bearer and token and then taking element [1], [0] is for bearer
    if(!token || token === ''){
        req.isAuth = false
        return next();
    }
    try {
        decodedToken =  jwt.verify(token, 'secretkey');

    } catch(err) {
        req.isAuth = false;
        return next()
    }
    if (!decodedToken) {
        req.isAuth = false;
        return next();
    }
    req.isAuth = true;
    req.userId = decodedToken.userId;
    console.log('Authenticated user:', req.userId);
    next();

};