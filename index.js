import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import axios from "axios";

async function startServer() {
  const server = new ApolloServer({
    typeDefs: `
            type User {
                id: ID!
                name: String!
                username: String! 
                email: String!
                phone: String! }
            type ToDo {
                id: ID!
                title: String!
                completed: Boolean
            }
            type Query {
                getToDo: [ToDo]
                getAllUsers: [User]
            }
        `,
    resolvers: {
      Query: {
        getToDo: async () =>
          (await axios.get("https://jsonplaceholder.typicode.com/todos")).data,
        getAllUsers: async () =>
          (await axios.get("https://jsonplaceholder.typicode.com/users")).data,
      },
    },
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 8000 },
  });

  console.log(`🚀 Server ready at: ${url}`);
}

startServer();
