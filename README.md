# AI StudyPal 📚🤖

**AI StudyPal** is an intelligent web application that helps students study more efficiently by allowing them to ask questions, upload PDFs or Images, and get AI-powered answers.

Built with:

* Node.js
* Express.js
* MongoDB
* EJS
* Bootstrap
* Gemini API (Google Generative AI)
* Live: https://ai-studypal-1.onrender.com/
---

## 🌟 Current Features

* 🔐 Authentication system (Sign Up, Login, Logout)
* 💬 AI-powered chat interface using Gemini API
* 📄 Upload PDF or 🖼️ Image (via one upload field: accepts both formats)
* 🧠 Document/Image content extraction using pdf-parse and Tesseract.js
* 📚 Chat history per user saved in MongoDB
* ✨ Clean Bootstrap UI + EJS templating
  

---

## 🚀 Upcoming / Planned Features

* ⏳ Upload optimization with Cloudinary or similar (optional)
* ⏳ User-specific chat management dashboard
* ⏳ Document summarization refinements
* ⏳MVC-like folder structure with separate routes, models, and views
---

## 🛠️ Installation

```bash
git clone https://github.com/Tushar-6969/AI-StudyPal.git
cd AI-StudyPal
npm install
```

Create a `.env` file containing:

```
GEMINI_API_KEY=your_google_gemini_api_key
MONGODB_URI=your_mongodb_uri
```

Make sure MongoDB is running locally or use MongoDB Atlas.

---

## 🗖️ Run the Project

```bash
node server/index.js
# or
nodemon server/index.js
```

Visit:
`http://localhost:3000`

---

## 🗒️ Project Structure

```
.
├── models/
│   ├── chatmodel.js
│   └── user.js
├── public/
│   ├── css/
│   │   └── styles.css
│   ├── images/
│   │   └── profile.jpg
│   └── js/
│       └── script.js
├── server/
│   ├── gemini.js
│   └── index.js
├── uploads/ (temporary storage for PDFs/Images)
├── views/
│   ├── home.ejs
│   ├── login.ejs
│   ├── signup.ejs
│   ├── previousChats.ejs
│   └── chatdetail.ejs
├── .env (not pushed to GitHub)
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── seed.js 
```

---

## 🤝 Contributions

Feel free to fork this repo, open issues, or submit pull requests. Collaboration is welcome!

---



---

## 📢 Contact

Made with ❤️ by Tushar Rathor
🔗 [LinkedIn](https://www.linkedin.com/in/tushar-rathor-277427259/)
🔉 [GitHub](https://github.com/Tushar-6969)
