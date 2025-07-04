'use client';

import { useParams } from 'next/navigation';
import QuizReview from '@/components/QuizReview';

export default function QuizReviewPage() {
  const { id } = useParams();

  return id ? <QuizReview id={id} /> : null;
}
