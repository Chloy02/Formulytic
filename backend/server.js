const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config({ path: __dirname + '/.env' });

const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

console.log('Mongo URI:', process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT || 5000, () => {
      console.log('Server running on port', process.env.PORT || 5000);
    });
  })
  .catch(err => console.error(err));