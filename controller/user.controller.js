import User from "../model/User.model.js";
import crypto from "crypto";
import "dotenv/config";
import bcrypt, { compare } from "bcryptjs";
import jwt from "jsonwebtoken";

import { sendMailToUser } from "../utils/email.js";

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "all fields are required",
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: "User already exists.",
      });
    }

    const user = await User.create({
      email,
      name,
      password,
    });

    if (!user) {
      return res.status(400).json({
        error: "User not registered.",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.verificationToken = token;
    await user.save();

    let emailBody = `${process.env.BASE_URL}/api/v1/users/verify/${token}`;

    sendMailToUser("Verify your email", email, emailBody);

    res.status(201).json({
      message: "User registered successfully",
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: "User not registered",
    });
  }

  res.send("registered");
};

const verifyUser = async (req, res) => {
  const token = req.params.token;
  if (!token) {
    return res.status(400).json({
      message: "invalid token",
    });
  }

  const user = await User.findOne({ verificationToken: token });

  if (!user) {
    return res.status(400).json({
      message: "invalid token",
    });
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();

  return res.status(201).json({
    message: "User verified successfully",
    statue: "success",
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "all fields are required",
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "invalid email or password",
      });
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(400).json({
        message: "invalid email or password",
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        message: "User is not verified, please verify your email",
      });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, "shhhhhhhhhh", {
      expiresIn: "24h",
    });

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    };

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.statue(400).json({
      message: "Unable to login",
    });
  }
};

export { registerUser, verifyUser, login };
