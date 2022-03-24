const { UserInputError } = require("apollo-server");
const Post = require("../../models/Post");
const checkAuth = require("../../utils/check-auth");

module.exports = {
  Mutation: {
    createComment: async (_, { postId, body }, context) => {
      const user = checkAuth(context);
      if (body.trim() === "") {
        throw new UserInputError("Empty comment", {
          errors: {
            body: "The body of the comment cannot be empty",
          },
        });
      }
      const post = await Post.findById(postId);
      if (post) {
        post.comments.unshift({
          body,
          username: user.username,
          createdAt: new Date().toISOString(),
        });
        await post.save();
        return post;
      } else throw new UserInputError("Post not found");
    },
    deleteComment: async (parent, { postId, commentId }, context) => {
      const user = checkAuth(context);
      const post = await Post.findById(postId);
      if (post) {
        const commentIndex = post.comments.findIndex((c) => c.id === commentId);

        if (post.comments[commentIndex].username === user.username) {
          post.comments.splice(commentIndex, 1);
        }
        await post.save();
        return post;
      }
    },
  },
};
