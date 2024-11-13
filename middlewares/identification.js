const jwt = require('jsonwebtoken')
exports.identifier = (req, res, next) => {
    let token
    if(req.headers.client==='not-browser'){
        token = req.headers.authorization
    }else{
        token = req.cookies.token
    }

    if(!token){
        return res.status(403).json({success: false, message:'you are not authorized'})
    }
    try{
        const userToken = token.split(' ')[1]
        const jwtVertified = jwt.verify(userToken, process.env.TOKEN_SECRET)
        if(jwtVertified){
            req.user = jwtVertified
            next()
        }else{
            throw new Error('you are not authorized')
        }
    }catch(error){
        console.log(error)
    }
}