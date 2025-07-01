const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const jwt_secret = process.env.JWT_SECRET;

exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(200).json(newUser);
  } catch (err) {
    console.error("Create user error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.logIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(404).json({ message: "User not found" });

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect)
      return res.status(401).json({ message: "Incorrect password" });

    const token = jwt.sign(
      { userId: existingUser._id, name: existingUser.name },
      jwt_secret,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      token,
      name: existingUser.name,
      isPremium: existingUser.isPremium
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
