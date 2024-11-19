const express = require("express")
const postsController = require('../controllers/postsController')
const { identifier } = require('../middlewares/identification');
const router = express.Router()

router.get('/all-posts', postsController.getPosts)
router.post('/create-post', identifier, postsController.createPost)
/*
router.get('/single-post', authController.signin)

router.put('/update-post', identifier, authController.sendVerificationCode)
router.delete('/delete-post', identifier, authController.verifyVerificationCode)*/

module.exports = router