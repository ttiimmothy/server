import express from "express";
import cors from "cors";
import {routes} from "@/routes";
import dotenv from "dotenv";
import {deletePasswordResetToken} from "@/lib/deletePasswordResetToken";
import Stripe from "stripe";
import {webhook} from "@/stripeWebhook";
import path from "path";
import {Server as httpServer} from "http"
import {Server} from "socket.io"

dotenv.config()

const app = express();
export const server = new httpServer(app)
export const io = new Server(server, {
  path: "/api/socket",
  cors: {
    origin: "*"
  }
})

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// NOTE: stripe webhooks need the identical raw body, express.json will turn the string into the object, but webhooks need the string that stripe signs
// even JSON.stringify to turn the object back to string don't work -> not identical to the string that stripe signs, so need to use express.raw

// IMPORTANT: need to put before express.json, otherwise the incoming req.body will be parsed to JSON object
app.post("/api/stripe/normal/webhooks", express.raw({type: "application/json"}), webhook)

// assign the current client socket to a specific room
io.on("connection", (socket) => {
  socket.on("join-user-room", (userId: string) => {
    socket.join(`user ${userId}`)
  })
})

// NOTE: only require for form submission, parses URL-encoded bodies <form method="POST" action="/submit"></form>
app.use(express.urlencoded({extended: true}))
// NOTE: require for json
app.use(express.json());

// app.use((req, res, next) => {
//   if (req.originalUrl === "/api/stripe/webhook") {
//     return raw({ type: "application/json" })(req, res, next);
//   }
//   return express.json()(req, res, next);
// });

// NOTE: require for raw string, {"Content-Type":"text/plain"}
app.use(express.text());
// NOTE: use cookie, now not use because cookie can't delete properly for the app
// app.use(cookieParser())

app.use(cors({
  origin: ["http://localhost:8084"],
  credentials: true
}))

app.use("/api", routes);
// to get the user avatar
// NOTE: work for http://localhost:8080/avatar-1756457150809.jpe but not http://localhost:8080/uploads/avatar-1756457150809.jpeg
// app.use(express.static(path.resolve(__dirname, "uploads")))

// NOTE: work for http://localhost:8080/uploads/avatar-1756457150809.jpeg
app.use("/uploads", express.static(path.resolve(__dirname, "uploads")))

// run every hour
setInterval(() => {
  deletePasswordResetToken()
}, 1000 * 60 * 60);

// only here use server instead of app
server.listen(8080, "0.0.0.0", () => {
  console.log("server starting")
  console.log("listening http://0.0.0.0:8080")
})