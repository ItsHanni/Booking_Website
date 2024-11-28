import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }

  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) return next(createError(403, "Token is not valid!"));
    req.user = user;
    next();
  });
};

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, next, () => {
    // Kiểm tra nếu vai trò là 'admin'
    if (req.user.role === 'admin') {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};

// Verify that host is allowed to confirm/reject booking
export const verifyHost = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.role === "host") {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};

// Verify that user is allowed to check-in/check-out
export const verifyUser = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.id === req.params.id || req.user.role === "admin") {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};
