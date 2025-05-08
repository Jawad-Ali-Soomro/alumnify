const { Post } = require("../models")

const createPost = async (req,res) => {
    const newPost = await  Post.create(req.body)
    if(!newPost)  {
        return res.json({
            success: false,
            message: "Post creation failed try again!"
        })
    }
    return res.json({
        success: true,
        message: "Post creation successful!",
        post: newPost
    })
}

const getPosts = async (req,res) => {
    const allPosts = await Post.find({}).populate("author")
    if(!allPosts) {
        return res.json({
            success: false,
            message: "Error getting all posts!"
        })
    } 
    return res.json({
        success: true,
        message: "Successfully fetched!",
        posts: allPosts
    })
}

module.exports = {
    createPost,
    getPosts
}