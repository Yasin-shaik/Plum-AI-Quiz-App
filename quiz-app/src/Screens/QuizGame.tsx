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

  if (!questions || questions.length === 0) {
    return <div className="text-center p-10 dark:text-white">Loading Error...</div>;
  }

  const totalQuestions = questions.length;
  const question = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const isAnswered = !!userAnswers[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  
  const handleAnswerSelect = (option: string) => {
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
    let calculatedScore = 0;
    questions.forEach((q, index) => {
      if (userAnswers[index] === q.correctAnswer) {
        calculatedScore += 1;
      }
    });
    setScore(calculatedScore);
    setAppState('RESULT'); 
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-6 md:p-10 border border-slate-100 dark:border-slate-700 transition-colors duration-300">
        <div className="mb-8">
          <div className="flex justify-between text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
            <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{topic}</span>
          </div>
          <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 dark:bg-indigo-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <QuizQuestion
          questionData={question}
          questionIndex={currentQuestionIndex}
          selectedAnswer={userAnswers[currentQuestionIndex]}
          onAnswerSelect={handleAnswerSelect}
        />
        <div className="flex justify-between items-center mt-10 pt-6 border-t border-slate-100 dark:border-slate-700">
          <button
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
            className={`w-full sm:w-auto justify-center flex items-center text-slate-500 dark:text-slate-400 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-30 disabled:hover:text-slate-500 dark:disabled:hover:text-slate-400 transition-colors p-3`}
          >
            <ChevronLeft className="w-5 h-5 mr-1" /> Previous
          </button>
          <button
            onClick={handleNext}
            disabled={!isAnswered} 
            className="w-full sm:w-auto justify-center flex items-center bg-indigo-600 dark:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200 dark:shadow-none"
          >
            {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
            {!isLastQuestion && <ChevronRight className="w-5 h-5 ml-2" />}
          </button>
        </div>
      </div>
    </div>
  );
};