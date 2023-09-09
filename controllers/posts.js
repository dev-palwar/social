const Posts = require("../Models/posts");
const Users = require("../Models/users");
const { sendResponse, getUser, log } = require("../Utils/functions");

const addPost = async (req, res) => {
  const { caption } = req.body;

  try {
    const loggedInUser = await getUser(req, res);
    const resFromDB = await Posts.create({ caption, owner: loggedInUser });
    await Users.updateOne(
      { email: loggedInUser.email },
      { $push: { posts: resFromDB } }
    );

    sendResponse(res, "Success", "Post added", resFromDB);
  } catch (error) {
    sendResponse(res, "Failed", "Internal server error", error.message);
  }
};

const deletePost = async (req, res) => {
  try {
    const { post_id } = req.params;
    const loggedInUser = await getUser(req, res);

    await Posts.deleteOne({ _id: post_id });
    const resFromDB = await Users.updateOne(
      { email: loggedInUser.email },
      { $pull: { posts: post_id } }
    );

    sendResponse(res, "Success", "Post deleted", resFromDB);
  } catch (error) {
    sendResponse(res, "Failed", "Post does not exists", error.message);
  }
};

const likePost = async (req, res) => {
  const { post_id } = req.params;
  const loggedInUser = await getUser(req, res);

  try {
    const post = await Posts.findById(post_id);
    const userLiked = post.likes.find((user) =>
      user._id.equals(loggedInUser._id)
    );

    if (!userLiked) {
      const resFromDB = await Posts.updateOne(
        { _id: post_id },
        { $push: { likes: loggedInUser } }
      );
      sendResponse(res, "Success", "Post liked", resFromDB);
    } else {
      const resFromDB = await Posts.updateOne(
        { _id: post_id },
        { $pull: { likes: { _id: loggedInUser._id } } }
      );
      sendResponse(res, "Success", "Post disliked", resFromDB);
    }
  } catch (error) {
    sendResponse(res, "Failed", "Internal server error", error.message);
  }
};

const addComment = async (req, res) => {
  const { post_id } = req.params;
  const { comment } = req.body;
  const loggedInUser = await req.user;

  try {
    const resFromDB = await Posts.updateOne(
      { _id: post_id },
      { $push: { commentsArr: { postedBy: loggedInUser, comment: comment } } }
    );

    sendResponse(res, "Success", "Comment added", resFromDB);
  } catch (error) {
    sendResponse(res, "Failed", "Internal server error", error.message);
  }
};

const deleteComment = async (req, res) => {
  const { comment_id } = req.body;
  const { post_id } = req.params;

  try {
    const resFromDB = await Posts.updateOne(
      { _id: post_id },
      { $pull: { commentsArr: { _id: comment_id } } }
    );
    sendResponse(res, "Success", "Comment deleted successfully", resFromDB);
  } catch (error) {
    sendResponse(res, "Failed", "Internal server error", error.message);
  }
};


module.exports = { addPost, deletePost, likePost, addComment, deleteComment };