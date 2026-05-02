const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

const authRoutes = require('./routes/auth');
const resumeRoutes = require('./routes/resume');

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// ✅ FIXED CORS (IMPORTANT)
app.use(cors({
  origin: "*",  // allow all (quick fix)
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);

// ✅ CHECK USERS ROUTE
app.get('/check-users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.get('/', (req, res) => {
  res.send('Resumify API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});