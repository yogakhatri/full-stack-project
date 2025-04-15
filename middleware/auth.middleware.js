import jwt from "jsonwebtoken";

export const isLoggedIn = async (req, res, next) => {
  try {
    console.log(req.cookies);
    const token = req?.cookies?.token || "";

    console.log("token found", token ? "Yes" : "No");

    if (!token) {
      console.log("NO Token");
      return res.status(401).json({
        success: false,
        message: "Authentication Failed",
      });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🚀 ~ isLoggedIn ~ decodedToken:", decodedToken);
    req.user = decodedToken;

    next();
  } catch (error) {
    console.log("Auth middleware failure");
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }

  next();
};
