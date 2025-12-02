import type { Question } from '../Context/QuizContext'; 
const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string; 
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/";
const MODEL_NAME = "gemini-2.5-flash-preview-09-2025";

// --- PROMPT ENGINEERING & SCHEMAS ---
const SYSTEM_INSTRUCTION_QUIZ = 
    "You are a strict quiz data generator. Your ONLY task is to generate exactly 5 multiple-choice questions (MCQs) on the provided topic. " +
    "You MUST return the output as a single, valid JSON array matching the provided schema. " +
    "Do not include any markdown formatting (like ```json), introduction, or conversational text.";

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
      "correctAnswer": { "type": "STRING", "description": "The exact text of one of the options." }
    },
    required: ["question", "options", "correctAnswer"]
  }
};

// --- HELPER: RETRY LOGIC ---
const fetchWithRetry = async (url: string, payload: any, retries = 3): Promise<Response> => {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) return response;

            if (response.status === 429 || response.status >= 500) {
                console.warn(`Attempt ${i + 1} failed with status ${response.status}. Retrying...`);
                const delay = Math.pow(2, i) * 1000; 
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                throw new Error(`API Request failed: ${response.statusText} (${response.status})`);
            }
        } catch (error) {
            if (i === retries - 1) throw error;
        }
    }
    throw new Error("Failed to fetch data after multiple attempts.");
};

// --- CORE FUNCTION 1: GENERATE QUESTIONS ---
export const generateQuestions = async (topic: string): Promise<Question[]> => {
  const apiUrl = `${BASE_URL}${MODEL_NAME}:generateContent?key=${apiKey}`;
  
  const payload = {
    contents: [{ parts: [{ text: `Generate 5 multiple-choice questions about '${topic}'.` }] }],
    systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION_QUIZ }] },
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: QUIZ_SCHEMA
    }
  };

  try {
    const response = await fetchWithRetry(apiUrl, payload);
    const result = await response.json();

    const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!jsonText) {
        throw new Error("Empty or malformed JSON response from AI.");
    }

    const questions = JSON.parse(jsonText) as Question[];

    if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error("AI returned an invalid question format.");
    }

    return questions.slice(0, 5);

  } catch (error) {
    console.error("AI Generation Error:", error);
    // Throw a simple message so LoadingScreen can display it
    throw new Error(`Failed to generate quiz for '${topic}'. Please try again.`); 
  }
};

// --- CORE FUNCTION 2: GENERATE FEEDBACK ---
export const generateFeedback = async (score: number, total: number, topic: string): Promise<string> => {
    const apiUrl = `${BASE_URL}${MODEL_NAME}:generateContent?key=${apiKey}`;
    const prompt = `The user scored ${score} out of ${total} on a quiz about '${topic}'. Generate a short, witty, and personalized feedback message (max 2 sentences) addressing the user directly.`;
    const payload = { contents: [{ parts: [{ text: prompt }] }] };

    try {
        const response = await fetchWithRetry(apiUrl, payload);
        const result = await response.json();
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
        return text || "Great job! You've completed the quiz.";
    } catch (error) {
        return "The AI is currently resting. Great effort on the quiz!";
    }
};