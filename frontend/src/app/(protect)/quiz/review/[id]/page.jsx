'use client';

import { useParams } from 'next/navigation';
import QuizReview from '@/components/quiz/QuizReview';

export default function QuizReviewPage() {
  const { id } = useParams();

  return id ? <QuizReview id={id} /> : null;
}
