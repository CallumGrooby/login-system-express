
# Express Login System

This project is a basic login system using node.js, express.js, and mongodb for the backend, and React for the front end. It demoonstrates how to setup user authentication with session management, allowing user to login and access protected routes. 

## Features
* User registration and login
* Session-based authentication
* Password hashing for security
* MongoDB integration via Mongoose
* Clean and simple user interface

## Technologies Used

* Backend: Node.js, Express.js
* Database: MongoDB, Mongoose
* Frontend: React, HTML, CSS, JavaScript
* Session Management: express-session
* Password Security: bcrypt
## Installation

Install login-system-express with npm

Clone the repository:
```bash
git clone https://github.com/CallumGrooby/login-system-express.git
cd login-system-express
```
Install dependencies:
```bash
npm install
```
Configure MongoDB connection:
* Create a .env file in the root directory.
* Add your MongoDB connection string:
```bash
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
```
Start the application:
```bash
npm run dev
```
