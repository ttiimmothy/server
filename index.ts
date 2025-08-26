import express,{urlencoded, json, text, raw, Request, Response} from "express";
import cors from "cors";
import {prisma, routes} from "@/router/routes";
import cookieParser from "cookie-parser";
import {config} from "dotenv";
import {deletePasswordResetToken} from "@/utils/deletePasswordResetToken";
import Stripe from "stripe";
import {webhook} from "@/middleware/stripeWebhook";

config()
const app = express();
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// NOTE: stripe webhooks need the identical raw body, express.json will turn the string into the object, but webhooks need the string that stripe signs
// even JSON.stringify to turn the object back to string don't work -> not identical to the string that stripe signs, so need to use express.raw
// IMPORTANT: need to put before express.json, otherwise the incoming req.body will be parsed to JSON object
app.post("/api/stripe/webhook", raw({type: "application/json"}), webhook)

// NOTE: only require for form submission, parses URL-encoded bodies <form method="POST" action="/submit"></form>
app.use(urlencoded({extended: true}))
// NOTE: require for json
app.use(json());

// app.use((req, res, next) => {
//   if (req.originalUrl === "/api/stripe/webhook") {
//     return raw({ type: "application/json" })(req, res, next);
//   }
//   return express.json()(req, res, next);
// });

// NOTE: require for raw string, {"Content-Type":"text/plain"}
app.use(text());
// NOTE: use cookie, now not use because cookie can't delete properly for the app
// app.use(cookieParser())

app.use(cors({
  origin: ["http://localhost:8084"],
  credentials: true
}))

app.use("/api", routes);

// run every hour
setInterval(() => {
  deletePasswordResetToken()
}, 1000 * 60 * 60);

app.listen(8080, "0.0.0.0", () => {
  console.log("listening http://0.0.0.0:8080")
})