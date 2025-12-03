import { useEffect } from 'react';
import { useQuiz } from '../Context/QuizContext';
import { Loader2, AlertCircle } from 'lucide-react';
import { generateQuestions } from '../Services/aiService';

export const LoadingScreen = () => {
  const { topic, setQuestions, setAppState, error, setError } = useQuiz();
  
  useEffect(() => {
    let mounted = true;
    const fetchQuiz = async () => {
      setError(null);
      try {
        const data = await generateQuestions(topic);
        if (mounted) {
          setQuestions(data);
          setAppState('QUIZ');
        }
      } catch (err: any) {
        if (mounted) {
            setError(err.message || "An unknown error occurred during generation."); 
        }
      }
    };
    fetchQuiz();
    return () => { mounted = false; };
  }, [topic, setQuestions, setAppState, setError]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4 animate-fade-in">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-full mb-4">
          <AlertCircle className="w-10 h-10 text-red-500 dark:text-red-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Generation Failed</h3>
        <p className="text-slate-500 dark:text-slate-400 mb-6">{error}</p>
        <button
          onClick={() => setAppState('MENU')} // Go back to topic selection
          className="px-6 py-2 bg-slate-800 dark:bg-slate-700 text-white rounded-xl hover:bg-slate-900 dark:hover:bg-slate-600 transition-colors shadow-lg"
        >
          Try Another Topic
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center animate-fade-in">
      <Loader2 className="w-12 h-12 text-indigo-600 dark:text-indigo-400 animate-spin mb-6" />
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Curating Questions...</h2>
      <p className="text-slate-500 dark:text-slate-400 max-w-xs">AI is researching "{topic}" to challenge your knowledge.</p>
      <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">This may take a few seconds.</p>
    </div>
  );
};