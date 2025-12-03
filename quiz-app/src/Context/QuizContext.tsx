import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { useEffect } from 'react';
// 1. Define the shape of a single Question
export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

// 2. Define the shape of our Context State
interface QuizContextType {
  appState: 'MENU' | 'LOADING' | 'QUIZ' | 'RESULT';
  setAppState: (state: 'MENU' | 'LOADING' | 'QUIZ' | 'RESULT') => void;
  topic: string;
  setTopic: (topic: string) => void;
  questions: Question[];
  setQuestions: (questions: Question[]) => void;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>;
  userAnswers: Record<number, string>;
  setUserAnswers: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  score: number;
  setScore: (score: number) => void;
  error: string | null;
  setError: (error: string | null) => void;
  
  // Feedback specific state
  feedback: string;
  setFeedback: (feedback: string) => void;
  isFeedbackLoading: boolean; // <--- ADDED THIS
  setIsFeedbackLoading: React.Dispatch<React.SetStateAction<boolean>>; // <--- ADDED THIS
  
  resetQuiz: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// 3. Create the Context
const QuizContext = createContext<QuizContextType | undefined>(undefined);

// 4. Create the Provider Component
export const QuizProvider = ({ children }: { children: ReactNode }) => {
  const [appState, setAppState] = useState<'MENU' | 'LOADING' | 'QUIZ' | 'RESULT'>('MENU');
  const [topic, setTopic] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  
  const [feedback, setFeedback] = useState<string>('');
  const [isFeedbackLoading, setIsFeedbackLoading] = useState<boolean>(false); // <--- ADDED THIS

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Helper function to reset everything when starting over
  const resetQuiz = () => {
    setAppState('MENU');
    setTopic('');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setScore(0);
    setError(null);
    setFeedback('');
    setIsFeedbackLoading(false); // <--- ADDED THIS
  };

  return (
    <QuizContext.Provider value={{
      appState, setAppState,
      topic, setTopic,
      questions, setQuestions,
      currentQuestionIndex, setCurrentQuestionIndex,
      userAnswers, setUserAnswers,
      score, setScore,
      error, setError,
      feedback, setFeedback,
      isFeedbackLoading, setIsFeedbackLoading, // <--- ADDED THIS
      resetQuiz,
      theme, toggleTheme
    }}>
      {children}
    </QuizContext.Provider>
  );
};

// 5. Create a custom hook for easy access
export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};