'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import useQuizStore from '@/store/useQuizStore';
import { GenerateQuiz } from '@/services/quiz';
import { useMutation } from '@tanstack/react-query';

export default function QuizGeneratePage() {
  const hasFetched = useRef(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { quizData, setQuizData } = useQuizStore();

  const topic = searchParams.get('topic');
  const difficulty = searchParams.get('difficulty');
  const numQuestions = searchParams.get('numQuestions');

  const { mutate: generateQuizTrigger, isPending } = useMutation({
    mutationFn: GenerateQuiz,
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Quiz generated successfully!');
        setQuizData(data.quiz);
        router.push(`/quiz/attempt/${data.quiz._id}`);
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error('Failed to generate quiz');
    },
  });

  useEffect(() => {
    if (hasFetched.current || quizData) return;
    if (!topic || !difficulty || !numQuestions) return;

    hasFetched.current = true;

    generateQuizTrigger({
      topic,
      difficulty,
      numQuestions: Number(numQuestions),
    });
  }, [topic, difficulty, numQuestions, quizData]);

return isPending ? (
  <div className="min-h-[80vh] flex items-center justify-center">
    <div className="text-center max-w-md flex flex-col gap-6 animate-fade-in">
      <div className="flex justify-center">
        <div className="loading loading-ring loading-lg text-primary scale-150" />
      </div>

      <h2 className="text-2xl font-bold text-primary">
        Generating Your Quiz...
      </h2>

      <p className="text-base text-base-content/70">
        Please wait while we prepare your questions. This will only take a few seconds!
      </p>

      <div className="flex justify-center">
        <progress className="progress progress-primary w-56 animate-pulse" />
      </div>

      <div className="text-sm italic text-base-content/50">
        🧠 Fueling up the brain cells...
      </div>
    </div>
  </div>
) : null;
}
