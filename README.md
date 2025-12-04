# AI-Assisted Knowledge Quiz

A dynamic, AI-powered quiz application built with **React**, **TypeScript**, and **Tailwind CSS**. This application leverages the **Google Gemini API** to generate unique multiple-choice questions on any topic provided by the user, track real-time progress, and provide personalized AI feedback upon completion.

---

## 1. Project Setup & Demo

### Web Setup  
To run this project locally:

#### Clone the repository:
```bash
git clone <repo-url>
cd quiz-app
```

#### Install dependencies:
```bash
npm install
```

#### Start the development server:
```bash
npm run dev
```

#### Open in Browser:
Navigate to:  
`http://localhost:5173/` *(or the URL shown in your terminal)*

---

### Demo
- **Screen Recording:** *(Insert Loom/YouTube link showing flow: Topic Selection → Loading → Quiz → Results → Dark Mode)*  
- **Hosted Demo:** *(Optional: Vercel/Netlify link)*

---

## 2. Problem Understanding

**Goal:**  
Build an engaging quiz interface where content is generated dynamically by an AI model based on user input.

### Key Challenges & Assumptions

- **Latency Management:**  
  AI generation takes 2–5 seconds, so a dedicated `LoadingScreen` with retry & error handling is required.

- **Data Consistency:**  
  The AI must return strict JSON. Any missing fields or extra characters could break the UI.  
  → Enforced using **schema validation**.

- **State Persistence:**  
  User score and answers are stored via **React Context**, preventing prop drilling and enabling smooth screen transitions.

---

## 3. AI Prompts & Iterations

Consistent JSON output required multiple prompt engineering iterations.

### **Iteration 1 — Natural Language (Failed)**
Prompt: *"Generate 5 multiple choice questions about {topic}."*  
- Returned conversational text or lists  
- ❌ Impossible to parse programmatically

### **Iteration 2 — JSON Constraint (Inconsistent)**
Prompt: *"Generate 5 questions about {topic} in JSON format."*  
- Returned JSON but wrapped inside markdown or with intro text  
- ❌ `JSON.parse()` would fail

### **Iteration 3 — Structured Output & Schema (Final Solution)**

Used **System Instruction + responseSchema**.

#### **System Instruction:**
“You are a strict quiz data generator... You MUST return a single valid JSON array… Do not include any markdown formatting.”

#### **JSON Schema:**
```ts
const QUIZ_SCHEMA = {
  type: "ARRAY",
  items: {
    type: "OBJECT",
    properties: {
      "question": { "type": "STRING" },
      "options": {
        "type": "ARRAY",
        "items": { "type": "STRING" },
        "description": "Exactly four distinct answer choices."
      },
      "correctAnswer": { "type": "STRING" }
    },
    required: ["question", "options", "correctAnswer"]
  }
};
```

**Outcome:**  
✔️ 100% consistent parsing success  
✔️ Enforced 5-question limit  
✔️ AI errors handled robustly

---

## 4. Architecture & Code Structure

A clean, component-based architecture using **React Context** for global state.

### **File Structure**
```
src/
├── Components/              # Reusable UI elements
│   └── QuizQuestion.tsx     # Renders a single question
├── Context/
│   └── QuizContext.tsx      # Global state (Score, Answers, Theme, AppState)
├── Screens/                 # App views
│   ├── TopicSelection.tsx
│   ├── LoadingScreen.tsx
│   ├── QuizGame.tsx
│   └── ResultScreen.tsx
├── Services/
│   └── aiService.ts         # Gemini API, schema validation, retry logic
└── App.tsx                  # Main router switching appState
```

### **State Management Strategy**
React Context chosen due to simple but global state requirements:

- **appState:** MENU → LOADING → QUIZ → RESULT  
- **userAnswers:** `Record<number, string>`  
- **theme:** persisted in `localStorage`

---

## 5. Screenshots / Screen Recording

- Topic Selection (Dark Mode)  
- Quiz Interface  
- Results & AI Feedback  

---

## 6. Known Issues & Improvements

### **1. Persistence on Refresh**
Refreshing resets quiz state.  
**Fix:** Sync `QuizContext` with `sessionStorage`.

### **2. API Rate Limits**
Rapid quiz requests may hit free-tier quota.  
**Fix:** Add cooldown timer or queue system.

### **3. Accessibility**
Keyboard navigation works, but focus management between screens can be improved.

---

## 7. Bonus Work

### 🌙 Dark Mode Support  
Theme toggle with Tailwind `dark:` classes, persisted via `localStorage`.

### ✨ Custom Animations  
Fade-in & slide-up animations added via `tailwind.config.js`.

### 🔄 Robust Error Handling  
aiService has exponential backoff (3 retries) for network/API issues.

### 📱 Fully Responsive  
Smooth experience from mobile to desktop.

---

**Built with ❤️ for the Plum SDE Intern Assignment**
