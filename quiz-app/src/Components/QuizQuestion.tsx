import { type Question } from '../Context/QuizContext';

// 1. Define what data this component needs
interface QuizQuestionProps {
  questionData: Question;
  questionIndex: number;
  selectedAnswer: string | undefined;
  onAnswerSelect: (answer: string) => void;
}

// 2. The Component Definition
export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  questionData,
  questionIndex,
  selectedAnswer,
  onAnswerSelect,
}) => {
  return (
    <div className="animate-fade-in">
      {/* Question Header */}
      <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-6 leading-relaxed">
        <span className="text-indigo-600 mr-2">Q{questionIndex + 1}.</span>
        {questionData.question}
      </h2>

      {/* Options List */}
      <div className="space-y-3">
        {questionData.options.map((option, idx) => {
          // Check if this specific option is the one currently selected
          const isSelected = selectedAnswer === option;
          
          return (
            <button
              key={idx}
              onClick={() => onAnswerSelect(option)}
              // Conditional Styling:
              // If selected -> Indigo background & border
              // If not -> White background & gray border
              className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between group text-lg
                ${isSelected
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm'
                  : 'border-slate-100 bg-white hover:border-indigo-200 hover:bg-slate-50 text-slate-700'
                }`}
            >
              <span className="font-medium">{option}</span>
              
              {/* Custom Radio Button Indicator */}
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                ${isSelected ? 'border-indigo-600' : 'border-slate-300'}`}
              >
                {isSelected && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};