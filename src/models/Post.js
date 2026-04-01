const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, 
    default: "Post sin título"
  },
  body: {
    type: String,
    required: true,
    default: "Post sin contenido"
  },
}, {timestamps: true});

module.exports = mongoose.model("Post", PostSchema);