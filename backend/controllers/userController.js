const asyncHandler = require("express-async-handler");
const User = require("../models/user.model");
const generateToken = require("../config.js/generateToken");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;
  try {
    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please Enter details for all the fields");
    }
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }
  
    const user = await User.create({
      name,
      email,
      password,
      pic,
    });
    if (user) {
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id),
      })
    } else {
      throw new Error("Failed to create the User");
    }
  } catch (err) {
    res.json({ err });
   throw new Error("Something went wrong", error);
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if(!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user && (await user.matchPassword(password))) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id),
      })
    } else {
      res.status(401);
      throw new Error("User email or password is incorrect");
    }
  } catch (err) {
    res.json({ err });
   throw new Error("Something went wrong", error);
  }
});

// /api/user?search=jay
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search ? {
    $or: [
      { name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } },
    ]
  } : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  return res.send(users);
});

module.exports = { registerUser, authUser, allUsers };
