# Formulytic: Karnataka Socio-Economic Survey Platform

**Formulytic** is a comprehensive, bilingual web application developed for the **`Government of Karnataka`**. The platform is designed to conduct socio-economic surveys across the state, assess the effectiveness of government schemes, and provide valuable insights through data visualization and analysis.

## Table of Contents

- [About The Project](#about-the-project)
  - [Key Features](#key-features)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [File Structure](#file-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## About The Project

This project was initiated to provide the Government of Karnataka with a powerful tool to understand the socio-economic landscape of the state. By enabling officials to create, distribute, and analyze surveys, Formulytic helps in evaluating the impact of public welfare schemes and gathering crucial data for future policy-making.

The platform is designed with a focus on accessibility, offering its interface in both **English** and **Kannada** to ensure wide reach and usability across Karnataka.

### Key Features

* **Bilingual Internationalization (i18n):** Implemented full support for both **English and Kannada**, showcasing a strong understanding of internationalization (i18n) and the ability to build applications for a diverse, multilingual user base.

* **Role-Based Access Control (RBAC):** Features a robust authentication system with distinct roles for administrators (government officials) and users (citizens). This ensures secure access to the admin dashboard, survey creation tools, and sensitive data.

* **Advanced Data Management & Visualization:** Empowers administrators with a comprehensive dashboard to:
    * Dynamically create and manage surveys.
    * Visualize real-time data with interactive charts and graphs.
    * Export survey results to **CSV** for in-depth analysis and reporting.

* **Secure User Authentication with JWT:** Utilizes **JSON Web Tokens (JWT)** for secure, stateless authentication and employs **`bcrypt`** for password hashing to ensure the security of user credentials and protect against common vulnerabilities.

* **Responsive & Accessible UI/UX:** The frontend is built with a focus on user experience, featuring a responsive design that works seamlessly across desktops, tablets, and mobile devices. The component-based structure, built with a modern UI library like **Shadcn/UI**, ensures a clean and intuitive interface.

* **Database Integration:** Demonstrates proficiency with both NoSQL (**MongoDB** with **Mongoose**) for flexible data modeling and an understanding of relational databases

### Built With

This project is built with a modern and robust technology stack:

**Frontend:**

* [Next.js](https://nextjs.org/)
* [React](https://reactjs.org/)
* [TypeScript](https://www.typescriptlang.org/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Shadcn/UI](https://ui.shadcn.com/)

**Backend:**

* [Node.js](https://nodejs.org/)
* [Express.js](https://expressjs.com/)
* [MongoDB](https://www.mongodb.com/)
* [Mongoose](https://mongoosejs.com/)
* [JSON Web Token (JWT)](https://jwt.io/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have the following software installed on your machine:

* Node.js (v14 or later)
* npm or yarn
* MongoDB

### Installation

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/chloy02/formulytic.git](https://github.com/chloy02/formulytic.git)
    cd formulytic
    ```

2.  **Install backend dependencies:**
    ```sh
    cd backend
    npm install
    ```

3.  **Set up backend environment variables:**

    Create a `.env` file in the `backend` directory and add the following:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

4.  **Install frontend dependencies:**
    ```sh
    cd ../frontend
    npm install
    ```

5.  **Set up frontend environment variables:**

    Create a `.env.local` file in the `frontend` directory and add the following:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:5000/api
    ```

6.  **Start the backend server:**

    From the `backend` directory, run:
    ```sh
    npm start
    ```

7.  **Start the frontend development server:**

    From the `frontend` directory, run:
    ```sh
    npm run dev
    ```

The application should now be running at `http://localhost:3000`.

## Usage

The application has two main user roles:

* **Citizen/User:** Can access and fill out questionnaires in either English or Kannada.
* **Admin (Government Official):** Can log in to the secure admin dashboard to:
    * Create, edit, and manage surveys.
    * View and analyze submitted responses.
    * Visualize data through charts and graphs.
    * Export survey data to a CSV file.

## File Structure

The repository is organized into three main directories:

* `backend/`: Contains the Node.js/Express.js backend server.
    * `config/`: Database configuration.
    * `controllers/`: Request handlers and business logic.
    * `models/`: Mongoose schemas for the database models.
    * `routes/`: API endpoint definitions.
    * `middleware/`: Custom middleware for authentication and error handling.
* `frontend/`: Contains the Next.js/React frontend application.
    * `app/`: The main application directory with pages and layouts.
    * `components/`: Reusable UI components.
    * `context/`: React Context providers for global state management.
    * `lib/`: Utility functions and translation files.
    * `services/`: Functions for making API calls to the backend.
* `database/`: Contains the database schema files.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

