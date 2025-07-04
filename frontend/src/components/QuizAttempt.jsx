 'use client';

import { useEffect, useRef } from 'react';
import useQuizStore from '../store/useQuizStore.js';
import { usePathname, useRouter } from 'next/navigation.js';

export default function QuizAttempt({ quiz }) {
  const pathname = usePathname();
  const initialPath = useRef(pathname);
 const {
  connectSocket,
  startQuiz,
  submitQuiz,
  setAnswer,
  selectedAnswers,
  currentIndex,
  setCurrentIndex,
  timer,
  restoreAttempt,
  formattedTime,
  submitted, // ✅ Add this
} = useQuizStore();


  useEffect(() => {
    connectSocket();
  }, []);

  useEffect(() => {
  if (quiz && quiz.studentId) {
    startQuiz({ quizId: quiz._id, userId: quiz.studentId });
    restoreAttempt({ quizId: quiz._id, userId: quiz.studentId }); // 🆕 Restore previous attempt
  }
}, [quiz]);

useEffect(() => {
  const interval = setInterval(() => {
    useQuizStore.getState().updateProgress();
  }, 30000);

  return () => clearInterval(interval);
}, []);

const router = useRouter();

useEffect(() => {
  if (submitted) {
    const timeout = setTimeout(() => {
      router.push('/quiz'); // 🔁 Or any page you want
    }, 3000); // 3 seconds delay so user sees success message

    return () => clearTimeout(timeout);
  }
}, [submitted]);

const hasMounted = useRef(false);

useEffect(() => {
  if (hasMounted.current) {
    if (pathname !== initialPath.current && !pathname.includes('/quiz/attempt')) {
      useQuizStore.getState().disconnectSocket();
      fetch('http://localhost:8000/api/quiz/leave', {
        method: 'POST',
        credentials: 'include',
      })
        .then(() => {
          router.push('/'); // 🔁 Redirect to home after clean exit
        })
        .catch((err) => console.error('Failed to leave quiz:', err));
    }
  } else {
    hasMounted.current = true;
  }
}, [pathname]);




  const handleOptionSelect = (id, option) => {
    setAnswer(id, option);
  };

  const handleSubmit = () => {
    console.log('submiiting quiz')
    submitQuiz();
  };

  const question = quiz.mcqs[currentIndex];

  return (
  <div className="p-6 max-w-3xl mx-auto">
    <h2 className="text-xl font-bold mb-4">Time left: {formattedTime}</h2>

    {submitted && (
      <div className="p-4 mb-4 bg-green-100 border border-green-300 text-green-700 rounded">
        🎉 Quiz submitted successfully! You can now close this tab.
      </div>
    )}

    <div className="mb-4 p-4 border rounded">
      <p className="mb-2 font-semibold">
        {currentIndex + 1}. {question?.question}
      </p>
      <ul>
        {question?.options?.map((opt, j) => (
          <li key={j}>
            <label>
              <input
                type="radio"
                name={`q-${currentIndex}`}
                value={opt}
                checked={selectedAnswers[question._id] === opt}
                onChange={() => handleOptionSelect(question._id, opt)}
                className="mr-2"
              />
              {opt}
            </label>
          </li>
        ))}
      </ul>
    </div>

    <div className="flex justify-between mt-4">
      <button
        disabled={currentIndex === 0}
        onClick={() => setCurrentIndex(currentIndex - 1)}
      >
        ◀ Prev
      </button>
      <button
        disabled={currentIndex === quiz.mcqs.length - 1}
        onClick={() => setCurrentIndex(currentIndex + 1)}
      >
        Next ▶
      </button>
    </div>

    {!submitted && (
      <button onClick={handleSubmit} className="btn btn-success mt-6">
        ✅ Submit
      </button>
    )}
  </div>
);

}