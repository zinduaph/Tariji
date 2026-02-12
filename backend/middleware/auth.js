

import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;


  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "No token" });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
     // Debug: log the entire payload
    req.userId = decoded.userId || decoded.id || decoded.sub || decoded.clerkUserId;
    req.auth = { userId: req.userId }; // For compatibility with Clerk-style code
    if (!req.userId) {
      console.error('No userId found in JWT payload');
      return res.status(401).json({ message: "Invalid token payload" });
    }
    next();
  } catch (error) {
    console.error('JWT verification error:', error);
    res.status(401).json({ message: "Invalid token" });
  }
};
export default authMiddleware