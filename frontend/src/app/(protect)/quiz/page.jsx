'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import QuizModal from '@/components/QuizModal';
import { GetAllQuizes } from '@/services/quiz';

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
  } = useQuery({
    queryKey: ['past-quizzes'],
    queryFn: GetAllQuizes,
  });
  const quizList = data?.quizzes ?? [];


  const filteredQuizzes = quizList?.filter((quiz) => {
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
        <div style={{ marginBottom: '1.5rem' }} className="flex flex-wrap items-center gap-4">
          <input
            type="text"
            placeholder="Search Topic..."
            className="input input-bordered w-48"
            value={filters.topic}
            onChange={(e) => setFilters((prev) => ({ ...prev, topic: e.target.value }))}
          />

          <select
            className="select select-bordered w-40"
            value={filters.difficulty}
            onChange={(e) => setFilters((prev) => ({ ...prev, difficulty: e.target.value }))}
          >
            <option value="">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <input
            type="date"
            className="input input-bordered"
            value={filters.startDate}
            onChange={(e) => setFilters((prev) => ({ ...prev, startDate: e.target.value }))}
          />

          <input
            type="date"
            className="input input-bordered"
            value={filters.endDate}
            onChange={(e) => setFilters((prev) => ({ ...prev, endDate: e.target.value }))}
          />

          <select
            className="select select-bordered w-40"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {/* Loading, Error, Empty States */}
        {isPending ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : isError ? (
          <div className="text-center text-red-500 mt-10">❌ Failed to load quizzes. Try again later.</div>
        ) : filteredQuizzes.length === 0 ? (
          <div style={{ marginTop: '2.5rem' }} className="text-center text-gray-600 text-lg">
            <img src="/empty-state.svg" alt="Empty" className="w-40 mx-auto mb-4" />
            No quizzes found. Try generating one!
          </div>
        ) : (
         <div style={{ padding: '1rem 0' }} className="flex flex-wrap gap-6 justify-start overflow-x-auto">
  {filteredQuizzes.map((quiz) => (
    <div
      key={quiz._id}
 className="card w-80 min-w-[18rem] shadow-lg border border-base-300 bg-base-100 hover:shadow-xl transition-all duration-300 flex-shrink-0"    >
      {/* Image */}
      <figure>
        <img
          src={quiz.image}
          alt={quiz.topic}
          className="w-full h-40 object-cover"
        />
      </figure>

      {/* Card Content */}
      <div style={{padding:'1rem'}} className="card-body">
        {/* Title and Difficulty */}
        <h2 className="card-title text-lg font-bold capitalize">
          {quiz.topic}
          <div className={`badge text-white capitalize ${
            quiz.difficulty === 'easy' ? 'badge-success' :
            quiz.difficulty === 'medium' ? 'badge-warning' :
            'badge-error'
          }`}>
            {quiz.difficulty}
          </div>
        </h2>

        {/* Duration */}
        <p className="text-sm text-gray-600">
          ⏱ <strong>Duration:</strong> {quiz.duration} min
        </p>

        {/* Created At */}
        <p className="text-sm text-gray-600">
          🕒 <strong>Created:</strong> {new Date(quiz.createdAt).toLocaleString()}
        </p>

        {/* Review Button */}
        <div style={{marginTop:'0.75rem'}} className="card-actions justify-end">
          <button
            className="btn btn-outline btn-accent btn-sm"
            onClick={() => router.push(`/quiz/review/${quiz._id}`)}
          >
            🔍 Review Quiz
          </button>
        </div>
      </div>
    </div>
  ))}
</div>

        )}
      </div>

      {isModalOpen && <QuizModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
