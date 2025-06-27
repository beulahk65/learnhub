// ✅ server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // To parse incoming JSON payloads

// ✅ MongoDB Connection
mongoose.connect('mongodb+srv://beulahkeerthana:rimuru5346828@learnhub.ix2ppct.mongodb.net/learnhub?retryWrites=true&w=majority&appName=learnhub')
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api', userRoutes); // All routes prefixed with /api

// ✅ Health Check
app.get('/', (req, res) => {
  res.send('Hello from backend!');
});

// ✅ Start Server
app.listen(4000, () => {
  console.log('🚀 Server is running at http://localhost:4000');
});
