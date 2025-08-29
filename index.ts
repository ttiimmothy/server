import express from "express";
import cors from "cors";
import {routes} from "@/routes";
import dotenv from "dotenv";
import {deletePasswordResetToken} from "@/lib/deletePasswordResetToken";
import Stripe from "stripe";
import {webhook} from "@/stripeWebhook";
import multer from "multer"
import path from "path";
import {app, io, server} from "./initServer";

dotenv.config()
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

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    if (req.path.startsWith("/api/documents/encrypted")) {
      // Store files for encrypted routes
      // NOTE: __dirname get the path of the root in project level instead of whole filesystem level
      callback(null, path.resolve(__dirname, "encrypted_uploads"));
    } else {
      callback(null, path.resolve(__dirname, "/uploads"))
    }
  },
  filename: (req, file, callback) => {
    callback(null, `${file.fieldname}-${Date.now()}-${file.mimetype.split("/")[1]}`)
  }
})
export const upload = multer({storage})

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
app.use(express.static(path.resolve(__dirname, "uploads")))

// run every hour
setInterval(() => {
  deletePasswordResetToken()
}, 1000 * 60 * 60);

// only here use server instead of app
server.listen(8080, "0.0.0.0", () => {
  console.log("server starting")
  console.log("listening http://0.0.0.0:8080")
})