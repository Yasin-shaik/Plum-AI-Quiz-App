import { QuizProvider, useQuiz } from './Context/QuizContext';
import { TopicSelection } from './Screens/TopicSelection';
import { LoadingScreen } from './Screens/LoadingScreen';
import { QuizGame } from './Screens/QuizGame';
import { ResultScreen } from './Screens/ResultScreen';
import { Moon, Sun } from 'lucide-react';

const QuizContent = () => {
  const { appState, theme, toggleTheme } = useQuiz();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4 font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-10">
        <button
          onClick={toggleTheme}
          className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 hover:scale-110 transition-transform text-indigo-600 dark:text-yellow-400"
          aria-label="Toggle Dark Mode"
          title="Toggle Dark Mode"
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
      </div>
      {appState === 'MENU' && <TopicSelection />}
      {appState === 'LOADING' && <LoadingScreen />}
      {appState === 'QUIZ' && <QuizGame />}
      {appState === 'RESULT' && <ResultScreen />}
    </div>
  );
};

export default function App() {
  return (
    <QuizProvider>
      <QuizContent />
    </QuizProvider>
  );
}