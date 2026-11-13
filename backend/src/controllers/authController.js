import bcrypt from 'bcryptjs';
import { db } from '../db.js';
import { generateToken } from '../middleware/auth.js';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';


// google authentication
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google Sign-In
export async function googleLogin(req, res) {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google credential is required.'
      });
    }

    // Verify the ID token with Google
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email || !payload.email_verified) {
      return res.status(401).json({
        success: false,
        message: 'Google account email is not verified.'
      });
    }

    const email = payload.email.trim().toLowerCase();
    const googleId = payload.sub;
    const usernameBase = email.split('@')[0].toLowerCase();

    // Find an existing account by email
    let user = db.prepare(`
      SELECT id, username, email, avatar_color, created_at
      FROM users
      WHERE email = ?
    `).get(email);

    // Create a new account if one doesn't exist
    if (!user) {
      let username = usernameBase;
      let suffix = 1;

      while (
        db.prepare('SELECT id FROM users WHERE username = ?').get(username)
      ) {
        username = `${usernameBase}${suffix++}`;
      }

      // Generate an unguessable password hash for Google-only accounts
      const randomPassword = crypto.randomBytes(32).toString('hex');
      const hashedPassword = bcrypt.hashSync(randomPassword, 10);

      const avatarColor = 'retro-cyan';

      const result = db.prepare(`
        INSERT INTO users (username, email, password, avatar_color, created_at)
        VALUES (?, ?, ?, ?, datetime('now', 'localtime'))
      `).run(username, email, hashedPassword, avatarColor);

      user = {
        id: result.lastInsertRowid,
        username,
        email,
        avatar_color: avatarColor
      };
    }

    const token = generateToken(user);

    return res.json({
      success: true,
      message: 'Google sign-in successful!',
      token,
      user
    });

  } catch (err) {
    console.error('Google login error:', err);

    return res.status(401).json({
      success: false,
      message: 'Google authentication failed.'
    });
  }
}

// Register a new user
export function register(req, res) {
  try {
    const { username, email, password, avatar_color = 'retro-cyan' } = req.body;

    // Basic validations
    if (!username || username.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Username must be at least 3 characters long.'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    const cleanUsername = username.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existing = db.prepare(
      'SELECT id, username, email FROM users WHERE username = ? OR email = ?'
    ).get(cleanUsername, cleanEmail);

    if (existing) {
      const field = existing.username === cleanUsername ? 'Username' : 'Email';
      return res.status(409).json({
        success: false,
        message: `${field} is already registered.`
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    const insertStmt = db.prepare(`
      INSERT INTO users (username, email, password, avatar_color, created_at)
      VALUES (?, ?, ?, ?, datetime('now', 'localtime'))
    `);

    const result = insertStmt.run(cleanUsername, cleanEmail, hashedPassword, avatar_color);
    const userId = result.lastInsertRowid;

    const newUser = {
      id: userId,
      username: cleanUsername,
      email: cleanEmail,
      avatar_color
    };

    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: 'Retro account created successfully!',
      token,
      user: newUser
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to create user account.',
      error: err.message
    });
  }
}

// Login existing user
export function login(req, res) {
  try {
    const { identifier, password } = req.body; // identifier can be username or email

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both username/email and password.'
      });
    }

    const cleanIdentifier = identifier.trim().toLowerCase();

    // Find user by username or email
    const user = db.prepare(`
      SELECT id, username, email, password, avatar_color, created_at
      FROM users
      WHERE username = ? OR email = ?
    `).get(cleanIdentifier, cleanIdentifier);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username/email or password.'
      });
    }

    // Compare password
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username/email or password.'
      });
    }

    const sanitizedUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar_color: user.avatar_color,
      created_at: user.created_at
    };

    const token = generateToken(sanitizedUser);

    res.json({
      success: true,
      message: 'Welcome back to the retro liquid stream!',
      token,
      user: sanitizedUser
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      message: 'Login failed due to a server error.',
      error: err.message
    });
  }
}

// Verify current authenticated user (Protected)
export function getMe(req, res) {
  res.json({
    success: true,
    user: req.user
  });
}

// Demo credentials helper
export function getDemoCredentials(req, res) {
  res.json({
    success: true,
    demo: {
      username: 'retro_pilot',
      email: 'pilot@taskflow.dev',
      password: 'password123'
    }
  });
}
