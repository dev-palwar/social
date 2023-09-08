const express = require("express");
const { sendResponse } = require("../Utils/functions");
const ifAuthenticated = require("../middlewares/Auth");
const { addPost, deletePost, likePost } = require("../controllers/posts");
const router = express.Router();

router.get("/", (req, res) => {
  sendResponse(res, "Success", "Post router is all set");
});

router.post("/add", addPost);
router.delete("/delete/:post_id", deletePost);
router.put("/like/:post_id", likePost);

module.exports = router;
