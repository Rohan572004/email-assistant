# 📬 Email Assistant - Chrome Extension with AI Reply Generator

Email Assistant is a Chrome Extension powered by a Spring Boot backend and Google's Gemini AI API. It helps you generate smart, professional email replies directly from your browser. You can even customize the tone of your response — formal, friendly, assertive, etc.

---

## 🧠 Features

- ✨ Chrome Extension interface
- 📤 AI-generated professional email replies
- 🎯 Customizable tone (formal, friendly, assertive, etc.)
- 🔗 Gemini API integration (Google Generative AI)
- 🧩 Spring Boot backend with REST API

---

## 📁 Project Structure

email-assistant/
├── backend/ # Spring Boot backend
│ └── src/...
├── frontend/ # Chrome extension (HTML/CSS/JS or React)
│ ├── manifest.json
│ ├── popup.html
│ ├── popup.js
│ └── ...
├── README.md
└── .gitignore



---

## 🚀 Getting Started

### 🔧 Prerequisites

- Java 17+
- Maven
- Node.js (if using React for frontend)
- Chrome Browser

---

### 📦 Backend Setup (Spring Boot)

1. Navigate to backend:
   ```bash
   cd backend
Configure API keys in application.properties:



gemini.api.url=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent
gemini.api.key=YOUR_GEMINI_API_KEY
Run the backend:



mvn spring-boot:run

# 📄 License
This project is licensed under the MIT License.
You are free to use, modify, and distribute this software in both personal and commercial projects.

See the full license details in the LICENSE file.
