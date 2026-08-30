import { web } from "./application/web";
import { db } from "./application/database";
import "dotenv/config";
import { Server } from "node:http";

let server: Server;
const port = process.env.PORT || 3000;

if (db) {
  console.log("Database connected");
  server = web.listen(port, () => {
    console.log(`app running at http://localhost:${port}`);
  });
}

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