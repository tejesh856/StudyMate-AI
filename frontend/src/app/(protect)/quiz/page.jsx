'use client';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { GetAllQuizes } from '@/services/quiz';
import dynamic from 'next/dynamic';
import EmptyState from '@/components/EmptyState';
import PendingState from '@/components/PendingState';
import { ClipboardList } from 'lucide-react';
import ErrorState from '@/components/ErrorState';
import QuizFilterPanel from '@/components/quiz/QuizFilterPanel';
import QuizCard from '@/components/quiz/QuizCard';
const QuizModal = dynamic(() => import('@/components/quiz/QuizModal'), {
  ssr: false,
});
export default function QuizPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    topic: '',
    difficulty: '',
    startDate: '',
    endDate: '',
  });
  const [sortOrder, setSortOrder] = useState('newest');

  const {
    data,
    isPending,
    isError,
    refetch
  } = useQuery({
    queryKey: ['past-quizzes'],
    queryFn: GetAllQuizes,
    refetchOnWindowFocus: false,
    
  });
  const quizList = data?.quizzes ?? [];


const filteredQuizzes =useMemo(() => {
  return quizList
    ?.filter((quiz) => {
      const { topic, difficulty, startDate, endDate } = filters;
      const quizDate = new Date(quiz.createdAt);
      return (
        (!topic || quiz.topic.toLowerCase().includes(topic.toLowerCase())) &&
        (!difficulty || quiz.difficulty === difficulty) &&
        (!startDate || quizDate >= new Date(startDate)) &&
        (!endDate || quizDate <= new Date(endDate))
      );
    })
    .sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
    });
}, [quizList, filters, sortOrder]);


  return (
    <div>

      <div style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '2.5rem' }} className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">📚 Past Quizzes</h1>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
            ➕ New Quiz
          </button>
        </div>

        {/* Filters */}
        <QuizFilterPanel
  filters={filters}
  setFilters={setFilters}
  sortOrder={sortOrder}
  setSortOrder={setSortOrder}
/>


        {/* Loading, Error, Empty States */}
        {isPending ? (
 <PendingState
  title="Fetching Quizzes..."
  subtitle="Please wait while we load your quiz archive. 📘"
    icon={<ClipboardList className="w-full h-full text-primary animate-bounce" />}

/>

        ) : isError ? (
<ErrorState
    icon={<ClipboardList className='w-full h-full text-error' />}
    title="Failed to Load Quizzes"
    message="Oops! Something went wrong while loading your quizzes. Please try again."
    onRetry={refetch}
    retryLabel="Retry"
  />        ) : filteredQuizzes.length === 0 ? (
          <EmptyState
    image="/quiz-empty.svg"
    title="No Quizzes Found"
    description="Try adjusting your filters or create a new quiz to begin!"
    buttonLabel="Create Quiz"
    onClick={() => setIsModalOpen(true)}
  />
        ) : (
         <div style={{ padding: '1rem 0' }} className="flex flex-wrap gap-6 justify-start overflow-x-auto">
  {filteredQuizzes.map((quiz) => (
    <QuizCard key={quiz._id} quiz={quiz} />
  ))}
</div>

        )}
      </div>

      {isModalOpen && <QuizModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
