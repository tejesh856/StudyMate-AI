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

  return isPending ? <div className="text-center p-8">Loading Quiz...</div> : null;
}
