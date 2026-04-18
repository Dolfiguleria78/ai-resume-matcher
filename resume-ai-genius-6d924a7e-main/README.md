# 🚀 AI Powered Resume & Job Matcher

An AI-powered web application that helps users analyze resumes, match jobs, and prepare for interviews** using modern web technologies and AI integration.

---

## 🌟 Features

* 📄 **Resume Analysis**

  * Analyze resumes for ATS compatibility
  * Provide intelligent feedback and improvements

* 🤖 **AI Resume Chat**

  * Chat-based assistant for resume guidance
  * Suggest improvements and enhancements

* 🎯 **Job Recommendation System**

  * Matches resumes with job descriptions
  * Provides match scores and insights

* 🎤 **Mock Interview System**

  * Simulates interview questions
  * AI-generated feedback and scoring

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* ShadCN UI

### Backend / Services

* Supabase (Database + Auth)
* Edge Functions (TypeScript)

### AI Integration

* OpenAI API (or similar AI models)

---

## 📁 Project Structure

```
resume-ai-genius/
│
├── public/                # Static assets
├── src/                   # Frontend source code
├── supabase/
│   ├── functions/         # Edge functions
│   │   ├── resume-chat/
│   │   ├── compare-resumes/
│   │   ├── recommend-jobs/
│   │   └── mock-interview/
│   └── migrations/        # Database migrations
│
├── index.html
├── package.json
├── tailwind.config.ts
├── vite.config.ts
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/resume-ai-genius.git
cd resume-ai-genius
```

---

### 2️⃣ Install dependencies

```bash
npm install
```

---

### 3️⃣ Setup Environment Variables

Create a `.env` file in root:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
OPENAI_API_KEY=your_openai_api_key
```

---

### 4️⃣ Run the project

```bash
npm run dev
```

App will run on:

```
http://localhost:8080/
```

---

## 🧪 Supabase Setup

1. Create a project on Supabase
2. Run migrations from `/supabase/migrations`
3. Deploy edge functions:

```bash
supabase functions deploy
```

---

## 📊 Use Cases

* Students improving resumes
* Job seekers preparing for interviews
* Recruiters analyzing candidate profiles
* Developers building AI-powered tools

---

## 🚀 Future Improvements

* 📈 Resume scoring dashboard
* 📥 PDF report generation
* 🔗 LinkedIn integration
* 🌐 Multi-language support

---

## 🤝 Contributing

Contributions are welcome!
Feel free to fork this repo and submit a pull request.

---

## 📜 License

This project is open-source and available under the MIT License.

---

## 👨‍💻 Author

**Dolfi Guleria**

* GitHub: https://github.com/Dolfiguleria78

---

⭐ If you like this project, don’t forget to star the repo!

