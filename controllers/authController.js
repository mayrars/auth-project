const { singupSchema } = require("../middlewares/validator")
exports.signup = async (req, res) => {
    const {email, password} = req.body;
    try{
        const {error, value} = singupSchema.validate({email, password})
    }catch(err){
        res.status(500).json({message: err.message})
    }
}