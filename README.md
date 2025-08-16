# AI StudyPal 📚🤖

**AI StudyPal** is an intelligent web application that helps students study more efficiently by allowing them to ask questions, upload PDFs or Images, and get **AI-powered answers**.  

---

## 🛠️ Tech Stack
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB (Mongoose ORM)  
- **Frontend**: EJS, Bootstrap  
- **AI Integration**: Gemini API (Google Generative AI)  
- **File Processing**: pdf-parse, Tesseract.js  

**Live Demo**: [AI StudyPal](https://ai-studypal-1.onrender.com/)

---

## 🌟 Features

- 🔐 User Authentication (Sign Up, Login, Logout)  
- 💬 Conversational AI chat interface powered by **Gemini API**  
- 📄 Upload **PDF** or 🖼️ **Image** (single upload field, supports both types)  
- 🧠 Automatic text extraction with **pdf-parse** & **Tesseract.js**  
- 💾 User-specific chat history stored in MongoDB  
- ✨ Sleek UI with Bootstrap + EJS Views  

---

## 🚀 Upcoming Features

- ☁️ File upload optimization via **Cloudinary** or similar service  
- 📂 User dashboard for managing past chats & documents  
- 📑 Better **document summarization**  
- 📐 Further improvements to MVC separation  

---

## 🏗️ Project Structure

project-root/
│
├── controllers/
│   ├── authController.js    # Handles login/signup/logout
│   ├── chatController.js    # Handles chat and uploads
│   └── homeController.js    # Handles home/dashboard routes
│
├── models/
│   ├── chatmodel.js         # Chat schema & model
│   └── user.js              # User schema & model
│
├── routes/
│   ├── authRoutes.js        # Authentication routes
│   ├── chatRoutes.js        # Chat + upload routes
│   └── homeRoutes.js        # Home/dashboard routes
│
├── views/
│   ├── home.ejs
│   ├── login.ejs
│   ├── signup.ejs
│   ├── previousChats.ejs
│   └── chatdetail.ejs
│
├── public/                  # Static assets (CSS, JS, images)
│
├── uploads/                 # Temporary storage for uploaded files
│
├── app.js                   # Main Express application entry point
├── gemini.js                # Handles AI API requests
├── .env                     # API keys & secrets
└── package.json


## ⚙️ Installation

Clone the repo and install dependencies:

git clone https://github.com/Tushar-6969/AI-StudyPal.git
cd AI-StudyPal
npm install


Create a `.env` file in the root folder:

GEMINI_API_KEY=your_google_gemini_api_key
MONGODB_URI=your_mongodb_uri
SESSION_SECRET=your_secret_key


Make sure MongoDB is running locally or use MongoDB Atlas.  

---

## ▶️ Run the Project

Start the server:

node app.js

or
nodemon app.js


Visit:  
👉 `http://localhost:3000`

---

## 🤝 Contributing

Contributions are welcome!  
- Fork the repo  
- Create a new branch  
- Commit improvements  
- Open a Pull Request  

---

## 📢 Contact

Made with ❤️ by **Tushar Rathor**  

🔗 [LinkedIn](https://www.linkedin.com/in/tushar-rathor-277427259/)  
🐙 [GitHub](https://github.com/Tushar-6969)  
