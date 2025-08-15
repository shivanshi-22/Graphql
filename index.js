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
        phone: String!
      }

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
        // FIX: Use userId instead of id
        user: async (todo) => {
          try {
            const res = await axios.get(
              `https://jsonplaceholder.typicode.com/users/${todo.userId}`
            );
            return res.data;
          } catch (err) {
            console.error(`❌ User not found for todo ${todo.id}`);
            return null; // return null instead of throwing
          }
        },
      },
      Query: {
        getToDo: async () => {
          try {
            const res = await axios.get(
              "https://jsonplaceholder.typicode.com/todos"
            );
            return res.data;
          } catch (err) {
            console.error("❌ Failed to fetch todos");
            return [];
          }
        },
        getAllUsers: async () => {
          try {
            const res = await axios.get(
              "https://jsonplaceholder.typicode.com/users"
            );
            return res.data;
          } catch (err) {
            console.error("❌ Failed to fetch users");
            return [];
          }
        },
        getUser: async (_, { id }) => {
          try {
            const res = await axios.get(
              `https://jsonplaceholder.typicode.com/users/${id}`
            );
            return res.data;
          } catch (err) {
            console.error(`❌ User ${id} not found`);
            return null;
          }
        },
      },
    },
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 8000 },
  });

  console.log(`🚀 Server ready at: ${url}`);
}

startServer();
