import express,{urlencoded, json} from "express";
import cors from "cors";
import {routes} from "@/router/routes";
import cookieParser from "cookie-parser";
import {config} from "dotenv";
import {deletePasswordResetToken} from "@/utils/deletePasswordResetToken";

config()

const app = express();

// only require for form submission, parses URL-encoded bodies <form method="POST" action="/submit"></form>
app.use(urlencoded({extended: true}))
// require for json
app.use(json());
// use cookie
app.use(cookieParser())

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