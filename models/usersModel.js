const { type } = require("express/lib/response")
const { verify } = require("jsonwebtoken")
const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        unique: [true, 'Email must be unique'],
        minLength: [6, 'Email must be at least 6 characters'],
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        trim: true,
        select: false,
    },
    verified:{
        type: Boolean,
        default: false
    },
    verificationCodeValidation: {
      type: String,
      select: false  
    },
    forgotPasswordCode: {
      type: String,
      select: false  
    },
    forgotPasswordCodeValidation: {
      type: Number,
      select: false  
    },
    
},{
    timestamps: true,
})

module.exports = mongoose.model('User', userSchema)