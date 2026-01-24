# Quick-chat-app

💬 Real-Time Chat Application
--------------------------------

A modern real-time chat application built with React, Context API, and Socket-based communication, featuring user authentication, online status, image messaging, and unseen message tracking.

🚀 Features
--------------

🔐 User authentication (login & logout)

💬 Real-time one-to-one messaging

🟢 Online / offline user status indicator

🖼️ Send text and image messages

👀 Unseen message count per user

🧑 Profile management (name, bio, profile picture)

⚡ Fast UI with Vite

🎨 Responsive & modern UI (Tailwind CSS)

🛠️ Tech Stack
---------------

Frontend
--

React (Vite)

React Router

Context API

Tailwind CSS

React Hot Toast

Backend (API / Services)
--

Node.js

Express.js

Socket.io

REST APIs

Other
--

Axios

FileReader API 

📂 Project Structure
----------------------
src/
│── assets/
│── components/
│── context/
│   ├── AuthContext.jsx
│   └── ChatContext.jsx
│── pages/
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   └── ProfilePage.jsx
│── App.jsx
│── main.jsx

⚙️ Installation & Setup
------------------------

Install dependencies
---

npm install


Start the development server
---

npm run dev


Open your browser:

http://localhost:5173

🔑 Environment Variables

Create a .env file and add required backend/API configuration:

VITE_API_URL=http://localhost:5000


🧠 Key Concepts Used
------------------------

React Context for global state (Auth & Chat)

Protected routes using Navigate

Real-time updates with sockets

Controlled forms & file uploads

Conditional rendering for online status


📌 Future Improvements
--------------------

Group chats

Message reactions

Typing indicators

Read receipts

Dark / light mode

