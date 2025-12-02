import { useQuiz } from '../Context/QuizContext';
import { useEffect } from 'react';
import { QuizQuestion } from '../Components/QuizQuestion';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export const QuizGame = () => {
  const {
    questions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    userAnswers,
    setUserAnswers,
    setScore,
    setAppState,
    topic
  } = useQuiz();
  
  useEffect(() => {
  console.log("Current Answers Tracking:", userAnswers);
}, [userAnswers]);

  // Safety check: If for some reason questions are empty, go back to menu
  if (!questions || questions.length === 0) {
    return <div className="text-center p-10">Loading Error...</div>;
  }

  const totalQuestions = questions.length;
  const question = questions[currentQuestionIndex];
  
  // 1. Progress Bar Logic
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  
  // 2. Check if the current question has an answer recorded
  const isAnswered = !!userAnswers[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  // --- NAVIGATION HANDLERS ---
  
  const handleAnswerSelect = (option: string) => {
    // Save answer to Context
    setUserAnswers(prev => ({ ...prev, [currentQuestionIndex]: option }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      finishQuiz();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const finishQuiz = () => {
    // Calculate Score immediately before moving to results
    let calculatedScore = 0;
    questions.forEach((q, index) => {
      if (userAnswers[index] === q.correctAnswer) {
        calculatedScore += 1;
      }
    });

    setScore(calculatedScore);
    setAppState('RESULT'); // Navigate to Screen 4
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in">
      <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 border border-slate-100">
        
        {/* PROGRESS HEADER */}
        <div className="mb-8">
          <div className="flex justify-between text-sm font-medium text-slate-500 mb-2">
            <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
            <span className="text-indigo-600 font-semibold">{topic}</span>
          </div>
          {/* Gray Track */}
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            {/* Colored Bar */}
            <div
              className="h-full bg-indigo-600 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* QUESTION COMPONENT (From Task 3.1) */}
        <QuizQuestion
          questionData={question}
          questionIndex={currentQuestionIndex}
          selectedAnswer={userAnswers[currentQuestionIndex]}
          onAnswerSelect={handleAnswerSelect}
        />
        
        {/* NAVIGATION BUTTONS */}
        <div className="flex justify-between items-center mt-10 pt-6 border-t border-slate-100">
          
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
            className={`flex items-center text-slate-500 font-medium hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors`}
          >
            <ChevronLeft className="w-5 h-5 mr-1" /> Previous
          </button>

          {/* Next / Finish Button */}
          <button
            onClick={handleNext}
            disabled={!isAnswered} // Force user to answer before proceeding
            className="flex items-center bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
          >
            {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
            {!isLastQuestion && <ChevronRight className="w-5 h-5 ml-2" />}
          </button>
        </div>

      </div>
    </div>
  );
};