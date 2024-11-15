const post = require('../models/postModel')
exports.getPosts = async(req, res) => {
    const {page} = req.query
    const postsPerPage = 10
    try{
        let pageNum=0
        if(page<=1){
            pageNum = 0
        }else{
            pageNum = page-1
        }
        const result = await post.find().sort({createdAt: -1}).skip(pageNum*postsPerPage).limit(postsPerPage)
    }catch(error){
        console.log(error)
    }
}