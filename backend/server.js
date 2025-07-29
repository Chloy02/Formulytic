const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config({ path: __dirname + '/.env' });

const authRoutes = require('./routes/authRoutes');
const responseRoutes = require('./routes/responseRoutes');
const questionRoutes = require('./routes/questions.router');
const healthRoutes = require('./routes/healthRoutes');

// Data Module
const { addQuestion } = require('./data/questions/questions.data');

const app = express();

// More specific CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000', 
    'http://localhost:3001', 
    'http://10.211.21.103:3000', 
    'http://10.144.123.84:3001',
    process.env.RAILWAY_STATIC_URL,
    process.env.RAILWAY_PUBLIC_DOMAIN
  ].filter(Boolean), // Remove undefined values
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allow credentials
};

// To Remove in Production
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

// addData();
// To Remove in Production


app.use(cors(corsOptions));
app.use(express.json());

// Health check route
app.use('/api', healthRoutes);

// Serve static files from Next.js build in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the Next.js build
  app.use(express.static(path.join(__dirname, '../frontend/.next/static')));
  app.use(express.static(path.join(__dirname, '../frontend/public')));
}

app.use('/api/auth', authRoutes);
app.use('/api/responses', responseRoutes);
app.use('/api/questions', questionRoutes);

console.log('Mongo URI:', process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📱 Frontend: http://localhost:${PORT}`);
      console.log(`🔗 API: http://localhost:${PORT}/api`);
      console.log(`❤️ Health: http://localhost:${PORT}/api/health`);
    });
  })
  .catch(err => console.error(err));