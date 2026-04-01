const express = require("express");
const postRouter = require("./post");
const router = express.Router();

router.use("/post", postRouter);

module.exports = router;