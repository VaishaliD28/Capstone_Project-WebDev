const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Database = require('node:sqlite').DatabaseSync;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'resumify-secret-key-change-in-production';

// ─── Database Setup ───────────────────────────────────────────────────────────
// SQLite database stored in backend/resumify.db (zero config, no external DB needed)
const db = new Database(path.join(__dirname, 'resumify.db'));

// Enable WAL mode for better performance
db.exec('PRAGMA journal_mode = WAL');

// Create tables on startup
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS resumes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL DEFAULT 'My Resume',
    template TEXT NOT NULL DEFAULT 'modern',
    data TEXT NOT NULL DEFAULT '{}',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

// ─── Middleware ───────────────────────────────────────────────────────────────
// CORS: allow requests from the React dev server AND from Vercel deployments
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    /\.vercel\.app$/,
    process.env.FRONTEND_URL,
  ].filter(Boolean),
  credentials: true,
}));

app.use(express.json());

// ─── Auth Middleware ──────────────────────────────────────────────────────────
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Resumify API is running' });
});

// ─── Auth Routes ──────────────────────────────────────────────────────────────

// POST /api/auth/signup
app.post('/api/auth/signup', (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    // Check if user already exists
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Insert user
    const stmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
    const result = stmt.run(name, email, hashedPassword);

    // Generate JWT
    const token = jwt.sign(
      { id: result.lastInsertRowid, email, name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: { id: result.lastInsertRowid, name, email },
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Internal server error during signup' });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Find user
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

// GET /api/auth/me  — verify token and return current user
app.get('/api/auth/me', authenticateToken, (req, res) => {
  try {
    const user = db.prepare('SELECT id, name, email, created_at FROM users WHERE id = ?').get(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (err) {
    console.error('Me error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Resume Routes ────────────────────────────────────────────────────────────

// GET /api/resumes — list all resumes for logged-in user
app.get('/api/resumes', authenticateToken, (req, res) => {
  try {
    const resumes = db.prepare(
      'SELECT id, title, template, created_at, updated_at FROM resumes WHERE user_id = ? ORDER BY updated_at DESC'
    ).all(req.user.id);

    res.json({ resumes });
  } catch (err) {
    console.error('Get resumes error:', err);
    res.status(500).json({ error: 'Failed to fetch resumes' });
  }
});

// GET /api/resumes/:id — get a single resume
app.get('/api/resumes/:id', authenticateToken, (req, res) => {
  try {
    const resume = db.prepare(
      'SELECT * FROM resumes WHERE id = ? AND user_id = ?'
    ).get(req.params.id, req.user.id);

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // Parse JSON data stored as string
    resume.data = JSON.parse(resume.data);
    res.json({ resume });
  } catch (err) {
    console.error('Get resume error:', err);
    res.status(500).json({ error: 'Failed to fetch resume' });
  }
});

// POST /api/resumes — create a new resume
app.post('/api/resumes', authenticateToken, (req, res) => {
  const { title = 'My Resume', template = 'modern', data = {} } = req.body;

  try {
    const stmt = db.prepare(
      'INSERT INTO resumes (user_id, title, template, data) VALUES (?, ?, ?, ?)'
    );
    const result = stmt.run(req.user.id, title, template, JSON.stringify(data));

    const resume = db.prepare('SELECT * FROM resumes WHERE id = ?').get(result.lastInsertRowid);
    resume.data = JSON.parse(resume.data);

    res.status(201).json({ message: 'Resume created', resume });
  } catch (err) {
    console.error('Create resume error:', err);
    res.status(500).json({ error: 'Failed to create resume' });
  }
});

// PUT /api/resumes/:id — update a resume
app.put('/api/resumes/:id', authenticateToken, (req, res) => {
  const { title, template, data } = req.body;

  try {
    const existing = db.prepare(
      'SELECT id FROM resumes WHERE id = ? AND user_id = ?'
    ).get(req.params.id, req.user.id);

    if (!existing) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    db.prepare(`
      UPDATE resumes
      SET title = COALESCE(?, title),
          template = COALESCE(?, template),
          data = COALESCE(?, data),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `).run(title, template, data ? JSON.stringify(data) : null, req.params.id, req.user.id);

    const updated = db.prepare('SELECT * FROM resumes WHERE id = ?').get(req.params.id);
    updated.data = JSON.parse(updated.data);

    res.json({ message: 'Resume updated', resume: updated });
  } catch (err) {
    console.error('Update resume error:', err);
    res.status(500).json({ error: 'Failed to update resume' });
  }
});

// DELETE /api/resumes/:id — delete a resume
app.delete('/api/resumes/:id', authenticateToken, (req, res) => {
  try {
    const result = db.prepare(
      'DELETE FROM resumes WHERE id = ? AND user_id = ?'
    ).run(req.params.id, req.user.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    res.json({ message: 'Resume deleted' });
  } catch (err) {
    console.error('Delete resume error:', err);
    res.status(500).json({ error: 'Failed to delete resume' });
  }
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Resumify API running at http://localhost:${PORT}`);
  console.log(`📦 SQLite database: ${path.join(__dirname, 'resumify.db')}`);
});
