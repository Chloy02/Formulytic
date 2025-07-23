const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config({ path: __dirname + '/.env' });

const authRoutes = require('./routes/authRoutes');
<<<<<<< HEAD
const responsesRoute = require('./routes/responses');
=======
const responseRoutes = require('./routes/responseRoutes');
>>>>>>> main

const app = express();

// More specific CORS configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001'], // Support both Next.js default and alternative ports
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/auth', authRoutes);
<<<<<<< HEAD
app.use('/api/responses', responsesRoute);
=======
app.use('/api/responses', responseRoutes);
>>>>>>> main

console.log('Mongo URI:', process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT || 5000, () => {
      console.log('Server running on port', process.env.PORT || 5000);
    });
  })
  .catch(err => console.error(err));