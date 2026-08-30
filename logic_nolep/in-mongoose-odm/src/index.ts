import { web } from "./application/web";
import "dotenv/config";
import { Server } from "node:http";
import mongoose from "mongoose";

let server: Server;
const port = process.env.PORT || process.env.DB_PORT || 3000;
const mongoUri = process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/fancy_todo_odm";

mongoose.connect(mongoUri).then(() => {
  console.log('Connected to MongoDB')
  server = web.listen(port, () => {
    console.log(`app running at http://localhost:${port}`);
  });
});

const exitHandler = () => {
    if (server) {
        server.close(() => {
        console.log('Server closed');
        process.exit(1);
    });
    } else {
        process.exit(1);
    }
};

const unexpectedErrorHandler = (error: unknown) => {
    console.log(error);
    exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
    console.log('SIGTERM received: closing HTTP server');
    if (server) {
        server.close(() => {
            console.log("Process terminated");
        });
    }
});