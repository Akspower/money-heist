const express = require("express");
const app = express();
const path = require("path");

const userModel = require("./models/user");
const connectDB = require("./db/connectDb");
const user = require("./models/user");
const PORT = 8000;
const dotenv = require("dotenv").config();
const create = require("./controllers/user.controller.js");
const mongoose = require("mongoose");
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

connectDB();

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("uncaughtException", (err) => {
  console.error("There was an uncaught error:", err);
  server.close(() => {
    process.exit(1); // Exit the process after cleanup
  });
});

// Handle graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    mongoose.connection.close(() => {
      console.log("MongoDB connection closed");
      process.exit(0);
    });
  });
});

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/read", async (req, res) => {
  let allusers = await userModel.find();
  res.render("read", { users: allusers });
});

app.post("/create", create);

app.get("/delete/:id", async (req, res) => {
  let users = await userModel.findOneAndDelete({ _id: req.params.id });
  res.redirect("/read");
});
app.get("/edit/:userid", async (req, res) => {
  let user = await userModel.findOne({ _id: req.params.userid });
  res.render("edit", { user });
});

app.post("/update/:userid", async (req, res) => {
  let { image, name, email } = req.body;
  let user = await userModel.findOneAndUpdate(
    { _id: req.params.userid },
    { image, name, email },
    { new: true }
  );
  res.redirect("/read");
});

// app.listen(PORT, () => {
//   connectDB();
//   console.log(`Run SuccessFully On ${PORT}`);
// });

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use. Try a different port.`);
    process.exit(1); // Exit with an error
  }
});
