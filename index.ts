import express from "express";
import cors from "cors";

const app = express();
// only require for form submission, parses URL-encoded bodies <form method="POST" action="/submit"></form>
app.use(express.urlencoded({extended: true}))
// require for json
app.use(express.json());

app.use(cors({
  origin: ["http://localhost:8081"]
}))

app.listen("8080", () => {
  console.log("listening http://localhost:8080")
})