const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config({ path: __dirname + '/.env' });

const authRoutes = require('./routes/authRoutes');
const responseRoutes = require('./routes/responseRoutes');
const questionRoutes = require('./routes/questions.router');

// Data Module (This section seems to be for testing/seeding, which is fine)
const { addQuestion } = require('./data/questions/questions.data');

const app = express();

// --- CORRECTED CORS CONFIGURATION ---

// Define a list of allowed origins.
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001'
];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// --- END OF CORS CONFIGURATION ---


// To Remove in Production (This function is fine as long as you don't call it)
function addData() {
  // Example usage of addQuestion
  const exampleQuestion = [{
    "questionnaireTitle": "Impact Evaluation of SCSP/TSP Schemes",
    "questionnaireDescription": [
      "Section 1: Respondent Information & Scheme Details",
      "Section 2: Socio-Economic & Livelihood Impact",
      "Section 3: Social Inclusion & Security",
      "Section 4: Awareness, Access & Quality of Service",
      "Section 5: Overall Satisfaction, Challenges & Recommendations",
      "Section 6: Questions Specific to Devadasi Children",
      "Depth Interviews (For Officials)",
      "Focus Group Discussions (Gram Sabhas/Stakeholder Meetings)",
    ],
    "sections": [
      {
        "sectionTitle": "User Information",
        "sectionDescription": "Enter User info",
        "questions": [
          {
            "questionID": "uname",
            "question": "Enter your Name",
            "questionType": "text",
            "options": []
          },
          {
            "questionID": "age",
            "question": "Enter your Age",
            "questionType": "number",
            "options": []
          }
        ]
      },
      {
        "sectionTitle": "Socio-Economic & Livelihood Impact",
        "sectionDescription": "Evaluating the economic and employment changes post-benefit.",
        "questions": [
          {
            "questionID": "Q4",
            "question": "Primary Occupation after receiving scheme benefit",
            "questionType": "text",
            "options": []
          },
          {
            "questionID": "Q5",
            "question": "Financial security post-benefit",
            "questionType": "rating",
            "options": ["1", "2", "3", "4", "5"]
          }
        ]
      }
    ],
    "createdBy": "60c72b2f9b1d8c001c8e4e3a",
  }
  ];

  addQuestion(exampleQuestion);
}
// addData(); // Good that this is commented out.

// Apply Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint for Railway debugging
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    port: process.env.PORT,
    mongoConnected: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Formulytic Backend API', 
    status: 'Running',
    version: '1.0.0'
  });
});

// Apply Routes
app.use('/api/auth', authRoutes);
app.use('/api/responses', responseRoutes);
app.use('/api/questions', questionRoutes);

// Connect to Database and Start Server
console.log('Mongo URI:', process.env.MONGO_URI ? 'Loaded' : 'Not Loaded');
console.log('Starting Railway deployment...');
console.log('PORT from env:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Server running on host 0.0.0.0 port ${PORT}`);
      console.log(`✅ Environment: ${process.env.NODE_ENV}`);
      console.log(`✅ Frontend URL: ${process.env.FRONTEND_URL}`);
      console.log(`✅ Health check: http://0.0.0.0:${PORT}/health`);
    });
    
    server.on('error', (err) => {
      console.error('❌ Server error:', err);
    });
  })
  .catch(err => {
    console.error('❌ Failed to connect to MongoDB', err);
    process.exit(1);
  });