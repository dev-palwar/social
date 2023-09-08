const Posts = require("../Models/posts");
const Users = require("../Models/users");
const { sendResponse, ppp, getUser } = require("../Utils/functions");

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
    await Users.updateOne(
      { email: loggedInUser.email },
      { $pull: { posts: post_id } }
    );

    sendResponse(res, "Success", "Post deleted");
  } catch (error) {
    sendResponse(res, "Failed", "Post does not exists", error.message);
  }
};

const likePost = async (req, res) => {
  try {
    const { post_id } = req.params;
    const loggedInUser = await getUser(req, res);

    const post = await Posts.findById(post_id);

    const userLiked = post.likes.find((user) =>
      user._id.equals(loggedInUser._id)
    );

    if (!userLiked) {
      await Posts.updateOne(
        { _id: post_id },
        { $push: { likes: loggedInUser } }
      );
      sendResponse(res, "Success", "Post liked");
    } else {
      await Posts.updateOne(
        { _id: post_id },
        { $pull: { likes: { _id: loggedInUser._id } } }
      );
      sendResponse(res, "Success", "Post disliked");
    }
  } catch (error) {
    sendResponse(res, "Failed", "Internal server error", error.message);
  }
};



module.exports = { addPost, deletePost, likePost };