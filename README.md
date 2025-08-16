# 📚 AI StudyPal

AI StudyPal is a MERN-based AI learning assistant that allows users to chat with an AI (powered by Gemini API), manage multiple conversations, and revisit previous chats. It follows the **MVC structure** for clean and scalable development.

---

## ✨ Features

* 🔑 **Authentication System** – Login / Signup / Logout
* 💬 **AI Chat Assistant** – Powered by Gemini API
* 📂 **Previous Chats** – View and reopen older conversations
* 📝 **Chat Titles** – Each chat session has its own title
* 📑 **Conversation History** – Stores complete conversation in MongoDB
* 🖼️ **EJS Views** – Server-side rendering for UI
* 📤 **File Upload Support** (optional for chat)
* 🛠️ **MVC Structure** – Clean separation of concerns

---

## 🏗️ Project Structure

```
project-root/
│
├── controllers/
│   ├── authController.js      # Handles login/signup/logout
│   ├── chatController.js      # Handles chat and uploads
│   └── homeController.js      # Handles home/dashboard routes
│
├── models/
│   ├── chatmodel.js           # Chat schema & model
│   └── user.js                # User schema & model
│
├── routes/
│   ├── authRoutes.js          # Authentication routes
│   ├── chatRoutes.js          # Chat + upload routes
│   └── homeRoutes.js          # Home/dashboard routes
│
├── views/
│   ├── home.ejs
│   ├── login.ejs
│   ├── signup.ejs
│   ├── previousChats.ejs
│   └── chatDetail.ejs
│
├── public/                    # Static assets (CSS, JS, images)
│
├── uploads/                   # Temporary storage for uploaded files
│
├── app.js                     # Main Express application entry point
├── gemini.js                  # Handles AI API requests
├── .env                       # API keys & secrets
└── package.json
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone https://github.com/yourusername/ai-studypal.git
cd ai-studypal
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Configure environment variables

Create a `.env` file:

```env
MONGO_URI=your_mongodb_connection
SESSION_SECRET=your_session_secret
GEMINI_API_KEY=your_gemini_api_key
PORT=3000
```

### 4️⃣ Start the server

```bash
npm start
```

---

## 🚀 Usage

* Open `http://localhost:3000` in your browser
* Signup or login
* Start a **new chat** or open **previous chats**
* Each chat has its own conversation history
* Upload files (if enabled)

---

## 🔮 Upcoming Features

* ✅ Dark Mode UI
* ✅ Chat export (PDF/Markdown)
* ✅ User profile & settings
* ✅ AI-powered study summarizer
* ✅ Multi-user support with roles
* ✅ Realtime chat (WebSockets)

---

## 📜 License

This project is licensed under the **MIT License** – feel free to use and modify.
