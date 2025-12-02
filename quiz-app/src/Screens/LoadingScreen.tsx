import { useEffect } from 'react';
import { useQuiz } from '../Context/QuizContext'; // Use capitalized Context path
import { Loader2, AlertCircle } from 'lucide-react';
import { generateQuestions } from '../Services/aiService';

export const LoadingScreen = () => {
  const { topic, setQuestions, setAppState, error, setError } = useQuiz();
  
  useEffect(() => {
    let mounted = true; // Flag to prevent setting state on unmounted component

    const fetchQuiz = async () => {
      // 1. Clear previous error before starting new fetch
      setError(null);
      
      try {
        // 2. Call the AI service
        const data = await generateQuestions(topic);
        
        if (mounted) {
          // 3. On success: store data and navigate
          setQuestions(data);
          setAppState('QUIZ');
        }
      } catch (err) {
        if (mounted) {
            // 4. On failure: display error message
            setError(err.message || "An unknown error occurred during generation."); 
        }
      }
      // Note: No finally block needed here, as navigation is explicitly handled on success.
    };

    fetchQuiz();
    
    // Cleanup function: If the component unmounts (user navigates away), stop pending operations
    return () => { mounted = false; };
  }, [topic, setQuestions, setAppState, setError]);


  // UI Rendering Logic based on Error State
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4 animate-fade-in">
        <div className="bg-red-50 p-4 rounded-full mb-4">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Generation Failed</h3>
        <p className="text-slate-500 mb-6">{error}</p>
        <button
          onClick={() => setAppState('MENU')} // Go back to topic selection
          className="px-6 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-900 transition-colors shadow-lg"
        >
          Try Another Topic
        </button>
      </div>
    );
  }

  // Default Loading UI
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center animate-fade-in">
      <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-6" />
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Curating Questions...</h2>
      <p className="text-slate-500 max-w-xs">AI is researching "{topic}" to challenge your knowledge.</p>
      <p className="mt-4 text-xs text-slate-400">This may take a few seconds.</p>
    </div>
  );
};