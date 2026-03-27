import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      // Verify Supabase JWT
      const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);
      
      /* 
         Supabase JWT contains 'sub' (User ID). 
         We'll check if this user exists in our MongoDB.
         If not, we can optionally create them or just pass the ID.
      */
      let user = await User.findOne({ supabaseId: decoded.sub });

      if (!user) {
        // Fallback: If user isn't in MongoDB yet, we create a record for them
        // using data from the Supabase JWT
        user = await User.create({
          supabaseId: decoded.sub,
          email: decoded.email,
          name: decoded.user_metadata?.full_name || 'GigB User',
          role: decoded.user_metadata?.role || 'user'
        });
      }

      req.user = user;
      return next();
    } catch (error) {
      console.error('DEBUG: Auth Error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export default protect;
