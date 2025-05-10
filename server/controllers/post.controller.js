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

const getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id).populate("author");
        
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found!"
            });
        }

        return res.json({
            success: true,
            message: "Post fetched successfully!",
            post
        });
    } catch (error) {
        console.error("Error fetching post:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching post",
            error: error.message
        });
    }
}

const toggleLikePost = async (req, res) => {
  try {
    const userId = req.body.userId;
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter(id => id.toString() !== userId.toString());
    } else {
      post.likes.push(userId);
    }

    post.likeCount = post.likes.length;
    await post.save();

    res.status(200).json({
      message: alreadyLiked ? 'Post disliked' : 'Post liked',
      liked: !alreadyLiked,
      likeCount: post.likeCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found!"
      });
    }

    // Check if the user is the author of the post
    if (post.author.toString() !== req.body.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this post!"
      });
    }

    await Post.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: "Post deleted successfully!"
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting post",
      error: error.message
    });
  }
};

module.exports = {
    createPost,
    getPosts,
    getPostById,
    toggleLikePost,
    deletePost
}