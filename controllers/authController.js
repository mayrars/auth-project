const jwt = require("jsonwebtoken")
const { signinSchema, signupSchema } = require("../middlewares/validator");
const User = require("../models/usersModel");
const { doHash, doHashValidation } = require("../utils/hashing");
const transport = require("../middlewares/sendMail");

exports.signup = async (req, res) => {
    const {email, password} = req.body;
    try{
        const {error, value} = signupSchema.validate({email, password})

        if(error){
            return res.status(401).json({success: false, message: error.details[0].message})
        }

        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(401).json({success: false, message: "User already exists"})
        }

        const hashedPassword = await doHash(password,12)
        
        const newUser = new User({
            email,
            password: hashedPassword
        })
        const result = await newUser.save()
        result.password = undefined;
        res.status(201).json({success: true, message: "User created successfully", result})
    }catch(err){
        console.log(err)
    }
}

exports.signin = async (req, res) => {
	const { email, password } = req.body;
	try {
		const { error, value } = signinSchema.validate({ email, password });
		if (error) {
			return res
				.status(401)
				.json({ success: false, message: error.details[0].message });
		}

		const existingUser = await User.findOne({ email }).select('+password');
		if (!existingUser) {
			return res
				.status(401)
				.json({ success: false, message: 'User does not exists!' });
		}
		const result = await doHashValidation(password, existingUser.password);
		if (!result) {
			return res
				.status(401)
				.json({ success: false, message: 'Invalid credentials!' });
		}
		const token = jwt.sign(
			{
				userId: existingUser._id,
				email: existingUser.email,
				verified: existingUser.verified,
			},
			process.env.TOKEN_SECRET,
			{
				expiresIn: '8h',
			}
		);

		res
			.cookie('Authorization', 'Bearer ' + token, {
				expires: new Date(Date.now() + 8 * 3600000),
				httpOnly: process.env.NODE_ENV === 'production',
				secure: process.env.NODE_ENV === 'production',
			})
			.json({
				success: true,
				token,
				message: 'logged in successfully',
			});
	} catch (error) {
		console.log(error);
	}
};
exports.signout= async (req, res) => {
	res.clearCookie('Authorization')
		.status(200)
		.json({ success: true, message: 'logged out successfully' });
}
exports.sendVerificationCode = async(req, res) => {
	const {email} = req.body;
	try{
	    const existingUser = await User.findOne({email})
	    if(!existingUser){
	        return res.status(401).json({success: false, message: "User does not exists"})
	    }
		if(existingUser.verified){
	        return res.status(400).json({success: false, message: "User already verified"})
	    }
		const codeValue  = Math.floor(Math.random() * 1000000).toString()
		let info = await transport.sendMail({
		    from: process.NODE_CODE_SENDING_EMAIL_ADDRESS,
			to: existingUser.email,
			subject: "Verification Code",
			html: '<h1>'+codeValue+'</h1>'
		})
		if(info.accepted[0]===existingUser.email){
		    res.status(200).json({success: true, message: "Verification code sent successfully"})
		}
	}catch(err){
	    console.log(err)
	}
}