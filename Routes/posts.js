const express = require("express");
const { sendResponse } = require("../Utils/functions");

const {
  addPost,
  deletePost,
  likePost,
  addComment,
  deleteComment,
} = require("../controllers/posts");
const router = express.Router();

router.get("/", (req, res) => {
  sendResponse(res, "Success", "Post route is working");
});

router.post("/add", addPost);
router.delete("/delete/:post_id", deletePost);
router.put("/like/:post_id", likePost);
router.put("/comment/:post_id", addComment);
router.delete("/comment/:post_id", deleteComment);

module.exports = router;
