import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("ASFJLS;DKFJS", socket.id);
    console.log("connected", io.engine.clientsCount);
    io.emit("count", io.engine.clientsCount);
    socket.on("disconnect", (reason) => {
      io.emit("count", io.engine.clientsCount);
    });
  });
  io.off("connection", (socket) => {
    console.log("disconnected", socket.id);
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
