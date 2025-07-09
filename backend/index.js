const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
// Make sure your .env file has the MONGO_URI variable
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully."))
  .catch(err => console.error("MongoDB connection error:", err));

// Simple root route
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// --- Routes will be added here by your teammates ---
// Example:
// const responseRoutes = require('./routes/responseRoutes');
// app.use('/api/responses', responseRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
