const User  = require("../models/user");

module.exports = create = async (req, res) => {
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
};
