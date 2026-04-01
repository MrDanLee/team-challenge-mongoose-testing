const Post = require("../models/Post");

const postController = {
  createPost: async (req, res) => {
    try {
      const post = await Post.create(req.body);
      res.json(post)
    } catch (error) {
      console.error(error)
      res.status(500).json("Error")
    }
  }, 
  getAllPosts: async (req, res) => {
    try {
      const post = await Post.find();
      res.json(post);
    } catch (error) {
      console.error(error);
      res.status(500).json("Error");
    }
  },
  getPostById: async (req, res) => {
    try {
      const _id = req.params._id;
      const post = await Post.findById(_id);
      res.json(post);
    } catch (error) {
      console.error(error)
      res.status(500).json("Error")
    }
  },
  getPostByTitle: async (req, res) => {
    try {
      const title = req.params.title;
      const post = await Post.findOne({ title });
      res.json(post);
    } catch (error) {
      console.error(error)
      res.status(500).json("Error")
    }
  },
  updatePostById: async (req, res) => {
    try {
      const _id = req.params._id;
      const post = await Post.findById(_id);
      const newTitle = req.body.title;
      const newContent = req.body.body;
      post.title = newTitle;
      post.body = newContent;
      res.json(post);
    } catch (error) {
      console.error(error)
      res.status(500).json("Error")
    }
  }, 
  deletePost: async (req, res) => {
    try {
      const _id = req.params._id;
      const post = await Post.findByIdAndDelete(_id);
      res.json(post)
    } catch (error) {
      console.error(error)
      res.status(500).json("Error")
    }
  }
}

module.exports = postController;