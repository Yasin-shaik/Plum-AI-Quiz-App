import { useState } from 'react';
import { useQuiz } from '../Context/QuizContext';
import { Sparkles, ArrowRight, BookOpen, Cpu, Globe, Heart } from 'lucide-react';

export const TopicSelection = () => {
  const { setTopic, setAppState, setError } = useQuiz();
  const [customTopic, setCustomTopic] = useState('');

  const predefinedTopics = [
    { id: 'tech', label: 'Tech Trends', icon: <Cpu className="w-6 h-6" /> },
    { id: 'history', label: 'History', icon: <BookOpen className="w-6 h-6" /> },
    { id: 'wellness', label: 'Wellness', icon: <Heart className="w-6 h-6" /> },
    { id: 'science', label: 'Science', icon: <Globe className="w-6 h-6" /> },
  ];

  const handleSelect = (selectedTopic: string) => {
    setTopic(selectedTopic);
    setError(null);
    setAppState('LOADING');
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 animate-fade-in">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-4">
          <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
          AI Knowledge Quiz
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          Select a topic below or type your own to generate a unique quiz instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {predefinedTopics.map((t) => (
          <button
            key={t.id}
            onClick={() => handleSelect(t.label)}
            className="flex items-center p-6 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl hover:border-indigo-600 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:shadow-md transition-all group text-left"
          >
            <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 group-hover:bg-white dark:group-hover:bg-slate-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {t.icon}
            </div>
            <span className="ml-4 text-lg font-bold text-slate-700 dark:text-white group-hover:text-indigo-900 dark:group-hover:text-indigo-300">
              {t.label}
            </span>
          </button>
        ))}
      </div>

      <div className="relative flex items-center justify-center mb-8">
        <hr className="w-full border-slate-200 dark:border-slate-700" />
        <span className="absolute bg-slate-50 dark:bg-slate-900 px-4 text-slate-400 font-medium text-sm uppercase tracking-wider">
          Or Create Your Own
        </span>
      </div>

      <div className="bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="e.g., 'Quantum Physics'..."
          className="w-full sm:flex-1 p-4 bg-transparent outline-none text-slate-800 dark:text-white placeholder:text-slate-400 font-medium"
          value={customTopic}
          onChange={(e) => setCustomTopic(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && customTopic.trim() && handleSelect(customTopic)}
        />
        <button
          onClick={() => handleSelect(customTopic)}
          disabled={!customTopic.trim()}
          className="w-full sm:w-auto bg-indigo-600 text-white p-4 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 font-bold"
        >
          Start Quiz <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};