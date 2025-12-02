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
    // 1. Update Global State
    setTopic(selectedTopic);
    
    // 2. Clear any previous errors
    setError(null);
    
    // 3. Move to the next screen (Loader)
    setAppState('LOADING');
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full mb-4">
          <Sparkles className="w-8 h-8 text-indigo-600" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-2">
          AI Knowledge Quiz
        </h1>
        <p className="text-slate-600 text-lg">
          Select a topic below or type your own to generate a unique quiz instantly.
        </p>
      </div>

      {/* Predefined Topics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {predefinedTopics.map((t) => (
          <button
            key={t.id}
            onClick={() => handleSelect(t.label)}
            className="flex items-center p-6 bg-white border-2 border-slate-100 rounded-2xl hover:border-indigo-600 hover:bg-indigo-50 hover:shadow-md transition-all group text-left"
          >
            <div className="p-3 bg-slate-100 rounded-lg text-slate-600 group-hover:bg-white group-hover:text-indigo-600 transition-colors">
              {t.icon}
            </div>
            <span className="ml-4 text-lg font-bold text-slate-700 group-hover:text-indigo-900">
              {t.label}
            </span>
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="relative flex items-center justify-center mb-8">
        <hr className="w-full border-slate-200" />
        <span className="absolute bg-gray-50 px-4 text-slate-400 font-medium text-sm">
          OR CREATE YOUR OWN
        </span>
      </div>

      {/* Custom Input Section */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex items-center">
        <input
          type="text"
          placeholder="e.g., 'Quantum Physics', '90s Pop Music'..."
          className="flex-1 p-4 bg-transparent outline-none text-slate-800 placeholder:text-slate-400 font-medium"
          value={customTopic}
          onChange={(e) => setCustomTopic(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && customTopic.trim() && handleSelect(customTopic)}
        />
        <button
          onClick={() => handleSelect(customTopic)}
          disabled={!customTopic.trim()}
          className="bg-indigo-600 text-white p-4 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 font-bold"
        >
          Start Quiz <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};