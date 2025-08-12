import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import bodyParser from "body-parser";
import cors from "cors";

async function startServer() {
    const app = express();
    const server = new ApolloServer({
        typeDefs: `
            type ToDo {
                id: ID!
                title: String!
                completed: Boolean
            }
            type Query {
                getToDo: [ToDo]
            }
        `,
        resolvers: {},
    });

    await server.start();
    app.use(bodyParser.json());
    app.use(cors());
    app.use("/graphql", expressMiddleware(server));

    app.listen(8000, () => console.log("Server started at port 8000."));
}

startServer();
