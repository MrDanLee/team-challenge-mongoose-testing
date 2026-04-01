const express = require("express");
const router = express.Router();
const postController = require("../controllers/PostController")

router.post("/create", postController.createPost);
router.get("/", postController.getAllPosts);

router.get("/id/:_id", postController.getPostById);

router.get("/title/:title", postController.getPostByTitle);

router.put("/id/:_id", postController.updatePostById);

router.delete("/id/:_id", postController.deletePost);

module.exports = router;