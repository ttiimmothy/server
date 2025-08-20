import express from "express";
import cors from "cors";
import {routes} from "@/router/routes";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config()

const app = express();

// only require for form submission, parses URL-encoded bodies <form method="POST" action="/submit"></form>
app.use(express.urlencoded({extended: true}))
// require for json
app.use(express.json());
// use cookie
app.use(cookieParser())

app.use(cors({
  origin: ["http://localhost:8084"],
  credentials: true
}))

app.use("/api", routes);

app.listen("8080", () => {
  console.log("listening http://localhost:8080")
})