import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import User from '../models/User.js';

// Configure JWKS client to fetch keys from Supabase
const client = jwksClient({
  jwksUri: `${process.env.SUPABASE_URL}/auth/v1/.well-known/jwks.json`,
  cache: true,
  rateLimit: true,
});

// Helper to get the signing key based on the 'kid' in the token header
const getKey = (header, callback) => {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      callback(err);
    } else {
      const signingKey = key.getPublicKey();
      callback(null, signingKey);
    }
  });
};

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      // 1. Verify token using dynamic JWKS keys from Supabase
      // This handles ECC, RSA, and rotations automatically
      const decoded = await new Promise((resolve, reject) => {
        jwt.verify(token, getKey, { algorithms: ['RS256', 'ES256', 'HS256'] }, (err, decoded) => {
          if (err) reject(err);
          else resolve(decoded);
        });
      });
      
      // 2. Check/Create user in MongoDB
      let user = await User.findOne({ supabaseId: decoded.sub });

      if (!user) {
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
      return res.status(401).json({ 
        message: 'Not authorized, token failed',
        error: error.message 
      });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export default protect;
