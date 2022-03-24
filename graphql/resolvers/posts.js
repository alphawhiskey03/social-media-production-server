const { AuthenticationError } = require("apollo-server");
const Post = require("../../models/Post");
const checkAuth = require("../../utils/check-auth");
module.exports = {
  Query: {
    getPosts: async () => {
      try {
        const posts = await Post.find({}).sort({ createAt: -1 });
        return posts;
      } catch (err) {
        // console.log(err);
      }
    },
    getPost: async (parent, { id }, context) => {
      try {
        const post = await Post.findOne({ _id: id });

        if (post) {
          return post;
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    createPost: async (_, { body, imageUrl, imageName }, context) => {
      const user = checkAuth(context);
      if (body.trim() === "") {
        throw new Error("The body of the post cannot be empty");
      }
      const newPost = new Post({
        body,
        imageUrl,
        imageName,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });
      const post = await newPost.save();

      return post;
    },
    deletePost: async (_, { id }, context) => {
      const user = checkAuth(context);
      const post = await Post.findById(id);
      if (post.username === user.username) {
        post.delete();
        return "Post deleted successfully";
      } else {
        throw new AuthenticationError("Not authorized");
      }
    },
    likePost: async (_, { postId }, context) => {
      const user = checkAuth(context);
      const post = await Post.findById(postId);
      if (post) {
        if (post.likes.find((like) => like.username === user.username)) {
          post.likes = post.likes.filter(
            (like) => like.username !== user.username
          );
        } else {
          post.likes.push({
            username: user.username,
            createdAt: new Date().toISOString(),
          });
        }
        await post.save();

        return post;
      }
    },
  },
};
