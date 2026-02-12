
import jwt from 'jsonwebtoken';

export const adminAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "No token" });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify token - admin tokens are signed with email+password
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    console.error('Admin JWT verification error:', error);
    res.status(401).json({ message: "Invalid admin token" });
  }
};

export default adminAuthMiddleware;
