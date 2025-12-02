import { useQuiz } from '../Context/QuizContext';
import { Trophy, CheckCircle, XCircle, RefreshCw, Sparkles } from 'lucide-react';
import { generateFeedback } from '../Services/aiService';
import { useEffect, useRef } from 'react';

export const ResultScreen = () => {
  const { 
    score, 
    questions, 
    userAnswers, 
    topic, 
    resetQuiz,
    feedback, 
    setFeedback,
    isFeedbackLoading,
    setIsFeedbackLoading
  } = useQuiz();

  // Use a ref to ensure we only generate feedback once per result session
const hasFetched = useRef(false);

useEffect(() => {
  // Logic: Only fetch if we haven't already AND there is no existing feedback
  if (!hasFetched.current && !feedback) {
    hasFetched.current = true;

    const fetchFeedback = async () => {
      setIsFeedbackLoading(true); // Start loading state
      try {
        // Call the service with the final score, total questions, and topic
        const message = await generateFeedback(score, questions.length, topic);
        setFeedback(message); // Store the AI message
      } catch (error) {
        console.error("Failed to generate feedback", error);
        setFeedback("Great job completing the quiz! (Feedback failed to load.)");
      } finally {
        setIsFeedbackLoading(false); // Stop loading state regardless of outcome
      }
    };

    fetchFeedback();
  }
}, [score, topic, questions.length, feedback, setFeedback, setIsFeedbackLoading]);

  const percentage = Math.round((score / questions.length) * 100);

  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in pb-10">
      
      {/* 1. SCORE CARD */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 mb-8">
        <div className="bg-indigo-600 p-8 text-center text-white relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-x-10 -translate-y-10"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full translate-x-5 translate-y-5"></div>
          
          <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-300 drop-shadow-lg" />
          <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
          <p className="text-indigo-100 text-lg mb-6">Topic: {topic}</p>
          
          <div className="inline-block bg-white/20 backdrop-blur-sm px-8 py-4 rounded-2xl">
            <span className="text-5xl font-extrabold">{score}</span>
            <span className="text-2xl opacity-80">/{questions.length}</span>
          </div>
          <p className="mt-4 font-medium text-indigo-100">{percentage}% Accuracy</p>
        </div>

        {/* 2. AI FEEDBACK SECTION (Placeholder for Task 4.2) */}
        <div className="p-8 bg-indigo-50 border-b border-indigo-100">
          <div className="flex gap-4">
            <div className="p-3 bg-white rounded-full h-fit shadow-sm text-indigo-600">
               <Sparkles className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-indigo-900 mb-2">AI Performance Review</h3>
              {isFeedbackLoading ? (
    // Shows the animation while the API call is pending
    <div className="flex items-center space-x-2 text-indigo-600/70 animate-pulse">
        {/* Loading animation elements */}
        <span className="text-sm font-medium ml-2">Analyzing your answers...</span>
    </div>
) : (
    // Shows the final text
    <p className="text-indigo-800 leading-relaxed">
        {feedback || "Detailed feedback will appear here."}
    </p>
)}
            </div>
          </div>
        </div>

        {/* 3. DETAILED REVIEW LIST */}
        <div className="p-8">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-slate-400" /> 
            Answer Review
          </h3>
          
          <div className="space-y-6">
            {questions.map((q, idx) => {
              const userAnswer = userAnswers[idx];
              const isCorrect = userAnswer === q.correctAnswer;

              return (
                <div key={idx} className="border border-slate-100 rounded-xl p-5 hover:border-slate-200 transition-colors bg-white">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-slate-400 font-mono text-sm mt-1">Q{idx + 1}</span>
                    <p className="font-bold text-slate-800 text-lg">{q.question}</p>
                  </div>

                  <div className="pl-8 space-y-2">
                    {/* User's Answer */}
                    <div className={`flex items-center gap-2 p-3 rounded-lg text-sm font-medium ${
                      isCorrect 
                        ? 'bg-green-50 text-green-700 border border-green-100' 
                        : 'bg-red-50 text-red-700 border border-red-100'
                    }`}>
                      {isCorrect ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      <span>You Selected: {userAnswer}</span>
                    </div>

                    {/* Correct Answer (if user was wrong) */}
                    {!isCorrect && (
                      <div className="flex items-center gap-2 p-3 rounded-lg text-sm font-medium bg-slate-50 text-slate-600 border border-slate-100">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Correct Answer: {q.correctAnswer}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. ACTION BUTTONS */}
      <div className="text-center">
        <button
          onClick={resetQuiz}
          className="inline-flex items-center gap-2 bg-slate-800 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-900 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <RefreshCw className="w-5 h-5" /> Start New Quiz
        </button>
      </div>
    </div>
  );
};