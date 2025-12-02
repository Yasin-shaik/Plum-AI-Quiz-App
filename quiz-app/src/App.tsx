
// Import the Context Provider and Hook
// NOTE: Assuming capitalized folder names as you specified: './Context/QuizContext'
import { QuizProvider, useQuiz } from './Context/QuizContext';

// Import all Screen Components
import { TopicSelection } from './Screens/TopicSelection';
import { LoadingScreen } from './Screens/LoadingScreen';
import { QuizGame } from './Screens/QuizGame';
import { ResultScreen } from './Screens/ResultScreen';


/**
 * QuizContent is the main component that uses the context state
 * to determine which screen (MENU, LOADING, QUIZ, RESULT) to display.
 */
const QuizContent = () => {
  // Use the hook to access the global state
  const { appState } = useQuiz();

  // The main router logic that displays the correct screen based on the application state
  return (
    // Set a consistent layout and background for the entire application
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans text-slate-800">
      
      {/* SCREEN 1: Topic Selection (appState: 'MENU') */}
      {appState === 'MENU' && <TopicSelection />}

      {/* SCREEN 2: Loading & AI Generation (appState: 'LOADING') */}
      {appState === 'LOADING' && <LoadingScreen />}

      {/* SCREEN 3: Quiz Gameplay (appState: 'QUIZ') */}
      {appState === 'QUIZ' && <QuizGame />}

      {/* SCREEN 4: Results and AI Feedback (appState: 'RESULT') */}
      {appState === 'RESULT' && <ResultScreen />}
    </div>
  );
};

/**
 * The default export wraps the entire application logic in the QuizProvider.
 * This makes the global state available to all child components.
 */
export default function App() {
  return (
    <QuizProvider>
      <QuizContent />
    </QuizProvider>
  );
}