
import jwt from 'jsonwebtoken';

export const adminAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "No token" });
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    return res.status(401).json({ message: "No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(401).json({ message: "Invalid admin token" });
    }
    next();
  } catch (error) {
    console.error('Admin JWT verification error:', error);
    res.status(401).json({ message: "Invalid admin token" });
  }
};

export default adminAuthMiddleware;
