import express from "express"
import {Server as httpServer} from "http"
import {Server} from "socket.io"
import debug from "debug";
debug.enable("socket.io:*,engine,engine:socket");

export const app = express();
export const server = new httpServer(app)
export const io = new Server(server, {
  path: "/api/socket",
  cors: {
    origin: "*"
  }
})