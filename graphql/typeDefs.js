const { gql } = require("apollo-server");
module.exports = gql`
  type Comment {
    id: ID!
    createdAt: String!
    username: String!
    body: String!
  }
  type Like {
    id: ID!
    createdAt: String!
    username: String!
  }
  type Post {
    id: ID!
    body: String!
    imageUrl: String
    imageName: String
    createdAt: String!
    username: String!
    comments: [Comment]!
    likes: [Like]!
    likeCount: Int!
    commentCount: Int!
  }
  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
  }

  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
  input LoginInput {
    username: String!
    password: String!
  }
  type Query {
    getPosts: [Post]
    getPost(id: ID!): Post
  }
  type Mutation {
    register(registerInput: RegisterInput!): User!
    login(loginInput: LoginInput!): User!
    createPost(body: String!, imageUrl: String, imageName: String): Post!
    deletePost(id: ID!): String!
    createComment(postId: ID!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!
  }
`;
