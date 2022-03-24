const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
const { MONGODB, PORT } = require("./config");
const resolvers = require("./graphql/resolvers");
const typeDefs = require("./graphql/typeDefs");

const PORT_ENV = process.env.port || PORT;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

mongoose
  .connect(MONGODB, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to DB");
    return server.listen({ port: PORT });
  })
  .then(({ url }) => console.log("Server up and running on : " + url))
  .catch((err) => {
    console.log(err);
  });
