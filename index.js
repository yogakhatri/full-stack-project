import express from "express";
import "dotenv/config";
import cors from "cors";
import db from "./utils/db.js";

const app = express();

app.use(
  cors({
    origin: "process.env.BASE_URL",
    credentials: true,
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/yogesh", (req, res) => {
  res.send("Hello Yogesh");
});

app.get("/khatri", (req, res) => {
  res.send("Hello Khatri");
});

// connect to db
db();

app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});
