-- Bilingual Questionnaire Database Schema
-- This is the proper database structure for production deployment

-- 1. Questionnaires table
CREATE TABLE questionnaires (
    id VARCHAR(50) PRIMARY KEY,
    title_en VARCHAR(500) NOT NULL,
    title_kn VARCHAR(500),
    description_en TEXT,
    description_kn TEXT,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Sections table
CREATE TABLE sections (
    id VARCHAR(50) PRIMARY KEY,
    questionnaire_id VARCHAR(50),
    title_en VARCHAR(500) NOT NULL,
    title_kn VARCHAR(500),
    description_en TEXT,
    description_kn TEXT,
    order_index INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (questionnaire_id) REFERENCES questionnaires(id) ON DELETE CASCADE,
    INDEX idx_questionnaire_order (questionnaire_id, order_index)
);

-- 3. Questions table
CREATE TABLE questions (
    id VARCHAR(50) PRIMARY KEY,
    section_id VARCHAR(50),
    text_en VARCHAR(1000) NOT NULL,
    text_kn VARCHAR(1000),
    placeholder_en VARCHAR(500),
    placeholder_kn VARCHAR(500),
    type ENUM('text', 'textarea', 'radio', 'checkbox', 'select', 'number', 'email', 'tel') NOT NULL,
    required BOOLEAN DEFAULT FALSE,
    order_index INT NOT NULL,
    validation_rules JSON, -- For storing validation rules like min/max length, regex patterns
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE,
    INDEX idx_section_order (section_id, order_index)
);

-- 4. Question options table (for radio, checkbox, select types)
CREATE TABLE question_options (
    id VARCHAR(50) PRIMARY KEY,
    question_id VARCHAR(50),
    value VARCHAR(200) NOT NULL,
    label_en VARCHAR(500) NOT NULL,
    label_kn VARCHAR(500),
    order_index INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    INDEX idx_question_order (question_id, order_index)
);

-- 5. User responses table
CREATE TABLE questionnaire_responses (
    id VARCHAR(50) PRIMARY KEY,
    questionnaire_id VARCHAR(50),
    user_id VARCHAR(50),
    status ENUM('draft', 'submitted') DEFAULT 'draft',
    submitted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (questionnaire_id) REFERENCES questionnaires(id),
    INDEX idx_user_questionnaire (user_id, questionnaire_id)
);

-- 6. Individual question responses
CREATE TABLE question_responses (
    id VARCHAR(50) PRIMARY KEY,
    response_id VARCHAR(50),
    question_id VARCHAR(50),
    answer_text TEXT, -- For text/textarea responses
    answer_values JSON, -- For multiple choice responses (checkbox)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (response_id) REFERENCES questionnaire_responses(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id),
    UNIQUE KEY unique_response_question (response_id, question_id)
);

-- Sample data insertion for SCSP/TSP questionnaire
INSERT INTO questionnaires (id, title_en, title_kn, description_en, description_kn, status) VALUES
('scsp-tsp-evaluation', 
 'SCSP/TSP Impact Evaluation Questionnaire',
 'SCSP/TSP ಪ್ರಭಾವ ಮೌಲ್ಯಮಾಪನ ಪ್ರಶ್ನಾವಳಿ',
 'Your responses will help us improve these important social programs',
 'ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆಗಳು ಈ ಪ್ರಮುಖ ಸಾಮಾಜಿಕ ಕಾರ್ಯಕ್ರಮಗಳನ್ನು ಸುಧಾರಿಸಲು ನಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತವೆ',
 'published');

INSERT INTO sections (id, questionnaire_id, title_en, title_kn, order_index) VALUES
('section1', 'scsp-tsp-evaluation', 'Section 1: Basic Information & Demographics', 'ವಿಭಾಗ 1: ಮೂಲಭೂತ ಮಾಹಿತಿ ಮತ್ತು ಜನಸಂಖ್ಯಾಶಾಸ್ತ್ರ', 1),
('section2', 'scsp-tsp-evaluation', 'Section 2: Socio-Economic Impact', 'ವಿಭಾಗ 2: ಸಾಮಾಜಿಕ-ಆರ್ಥಿಕ ಪ್ರಭಾವ', 2),
('section3', 'scsp-tsp-evaluation', 'Section 3: Social Inclusion', 'ವಿಭಾಗ 3: ಸಾಮಾಜಿಕ ಸೇರ್ಪಡೆ', 3);

INSERT INTO questions (id, section_id, text_en, text_kn, placeholder_en, placeholder_kn, type, required, order_index) VALUES
('fullname', 'section1', 'Full Name', 'ಪೂರ್ಣ ಹೆಸರು', 'Enter your full name', 'ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರು ನಮೂದಿಸಿ', 'text', TRUE, 1),
('district', 'section1', 'District/Taluk', 'ಜಿಲ್ಲೆ/ತಾಲ್ಲೂಕು', 'Enter your district and taluk', 'ನಿಮ್ಮ ಜಿಲ್ಲೆ ಮತ್ತು ತಾಲ್ಲೂಕು ನಮೂದಿಸಿ', 'text', TRUE, 2),
('age', 'section1', 'Age', 'ವಯಸ್ಸು', 'Enter your age', 'ನಿಮ್ಮ ವಯಸ್ಸು ನಮೂದಿಸಿ', 'number', TRUE, 3),
('gender', 'section1', 'Gender', 'ಲಿಂಗ', NULL, NULL, 'radio', TRUE, 4),
('education', 'section1', 'Education Level', 'ಶಿಕ್ಷಣ ಮಟ್ಟ', NULL, NULL, 'select', TRUE, 5);

INSERT INTO question_options (id, question_id, value, label_en, label_kn, order_index) VALUES
-- Gender options
('gender_male', 'gender', 'male', 'Male', 'ಪುರುಷ', 1),
('gender_female', 'gender', 'female', 'Female', 'ಮಹಿಳೆ', 2),
('gender_other', 'gender', 'other', 'Other', 'ಇತರೆ', 3),

-- Education options
('edu_primary', 'education', 'primary', 'Primary', 'ಪ್ರಾಥಮಿಕ', 1),
('edu_secondary', 'education', 'secondary', 'Secondary', 'ಮಾಧ್ಯಮಿಕ', 2),
('edu_higher_secondary', 'education', 'higher_secondary', 'Higher Secondary', 'ಉನ್ನತ ಮಾಧ್ಯಮಿಕ', 3),
('edu_graduate', 'education', 'graduate', 'Graduate', 'ಪದವಿ', 4),
('edu_postgraduate', 'education', 'postgraduate', 'Post Graduate', 'ಸ್ನಾತಕೋತ್ತರ', 5);

-- Indexes for better performance
CREATE INDEX idx_questionnaire_status ON questionnaires(status);
CREATE INDEX idx_response_status ON questionnaire_responses(status);
CREATE INDEX idx_response_submitted ON questionnaire_responses(submitted_at);
CREATE INDEX idx_response_user ON questionnaire_responses(user_id);

-- Views for easier querying with translations
CREATE VIEW questionnaire_with_translations AS
SELECT 
    q.id,
    q.title_en,
    q.title_kn,
    q.description_en,
    q.description_kn,
    q.status,
    COUNT(DISTINCT s.id) as section_count,
    COUNT(DISTINCT questions.id) as question_count
FROM questionnaires q
LEFT JOIN sections s ON q.id = s.questionnaire_id
LEFT JOIN questions ON s.id = questions.section_id
GROUP BY q.id;
