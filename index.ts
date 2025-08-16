import express from "express";
import cors from "cors";
import {routes} from "@/router/routes";

const app = express();
// only require for form submission, parses URL-encoded bodies <form method="POST" action="/submit"></form>
app.use(express.urlencoded({extended: true}))
// require for json
app.use(express.json());

app.use(cors({
  origin: ["http://localhost:8084"]
}))

app.use("/api", routes);

app.listen("8080", () => {
  console.log("listening http://localhost:8080")
})