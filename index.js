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
                user: User
            }
            type Query {
                getToDo: [ToDo]
                getAllUsers: [User]
                getUser(id: ID!): User
            }
        `,
    resolvers: {
        ToDo: {
          user: async (todo) =>
            (await axios.get(`https://jsonplaceholder.typicode.com/users/${todo.id}`)).data,
        },
      Query: {
        getToDo: async () =>
          (await axios.get("https://jsonplaceholder.typicode.com/todos")).data,
        getAllUsers: async () =>
          (await axios.get("https://jsonplaceholder.typicode.com/users")).data,
        getUser: async (parent,{id}) =>
          (await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)).data,
      },
    },
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 8000 },
  });

  console.log(`🚀 Server ready at: ${url}`);
}

startServer();
