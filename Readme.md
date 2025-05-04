
# SilentTalk: AI Communication for the Deaf and Mute (Web Version)

SilentTalk is a beautifully designed AI-powered web application that enables real-time communication for deaf and mute individuals. Using computer vision, speech recognition, and AI translation, it bridges the communication gap without the need for third-party interpreters.

---

## 🌟 Features

- 🎥 Real-time Sign Language Recognition via webcam
- 🗣️ Instant Speech-to-Text transcription
- 💬 Text-to-Speech synthesis with voice tone customization
- 🌍 Multilingual Translation and Context-Aware Messaging
- 🔄 Live Chat Mode for natural conversation flow
- 🎨 Fully responsive, modern, and accessible UI
- 🛠️ Offline Mode support (limited)

---

## 🖥️ Tech Stack

| Layer        | Technology                                   |
|-------------|----------------------------------------------|
| Frontend    | React.js, TailwindCSS, shadcn/ui, Framer Motion, Heroicons |
| Backend     | Node.js (Express), Firebase Authentication    |
| Database    | Firestore (Firebase)                          |
| AI Models   | TensorFlow.js, MediaPipe, Web Speech API      |
| Hosting     | GitHub Actions, Firebase Hosting or Vercel    |

---

## 📦 How to Install and Run the App

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/SilentTalk.git
cd SilentTalk
```

### 2. Install Dependencies
```bash
npm install cross-env --save-dev
npm install dotenv



```

### 3. Set up Environment Variables
Create a `.env` file at the root and add:
```env
DATABASE_URL="file:./dev.db"
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
```

### 4. Start the Development Server
```bash
npm run dev
```
App will be available at [http://localhost:5000](http://localhost:5000).



