const express = require("express");
const app = express();
const path = require("path");

const userModel = require("./models/user");
const connectDB = require("./db/connectDb");
const PORT = 8000;
require("dotenv").config();
const User  = require("./models/user.js");
const mongoose = require("mongoose");
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set('views', path.join(__dirname, 'views'));


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

app.post("/create", async(req,res)=>{
    const { email, name, image } = req.body;

  // Check if all fields are provided
  if (!email || !name || !image) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if user already exists
  const isExisting = await User.findOne({ $or: [{ email }, { name }] });
  if (isExisting) {
    return res.status(409).json({ message: "User Already Exists" }); // 409 Conflict status code
  }

  // Create a new user
  const user = await User.create({ email, name, image });

  res.render("index");
});

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
