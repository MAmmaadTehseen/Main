const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password");
    if (!req.user) return res.status(401).json({ message: "User not found" });
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

exports.adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
  next();
};

exports.advisorOnly = (req, res, next) => {
  if (req.user.role !== "advisor") {
    return res.status(403).json({ message: "Access denied: Advisors only" });
  }
  next();
};

exports.studentOnly = (req, res, next) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ message: "Access denied: Students only" });
  }
  next();
};
