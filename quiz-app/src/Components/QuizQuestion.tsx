import React from 'react';
import { type Question } from '../Context/QuizContext';

interface QuizQuestionProps {
  questionData: Question;
  questionIndex: number;
  selectedAnswer: string | undefined;
  onAnswerSelect: (answer: string) => void;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  questionData,
  questionIndex,
  selectedAnswer,
  onAnswerSelect,
}) => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white mb-6 leading-relaxed transition-colors duration-300">
        <span className="text-indigo-600 dark:text-indigo-400 mr-2">Q{questionIndex + 1}.</span>
        {questionData.question}
      </h2>
      <div className="space-y-3">
        {questionData.options.map((option, idx) => {
          const isSelected = selectedAnswer === option;
          return (
            <button
              key={idx}
              onClick={() => onAnswerSelect(option)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between group text-lg
                ${isSelected
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm dark:bg-indigo-900/30 dark:border-indigo-500 dark:text-indigo-300'
                  : 'border-slate-100 bg-white text-slate-700 hover:border-indigo-200 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:border-indigo-500'
                }`}
            >
              <span className="font-medium">{option}</span>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
                ${isSelected 
                  ? 'border-indigo-600 dark:border-indigo-500' 
                  : 'border-slate-300 dark:border-slate-500'}`}
              >
                {isSelected && <div className="w-2.5 h-2.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};