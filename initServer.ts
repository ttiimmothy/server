import express from "express"
import {Server as httpServer} from "http"
import {Server} from "socket.io"

export const app = express();
export const server = new httpServer(app)
export const io = new Server(server, {
  cors: {
    origin: "*"
  }
})