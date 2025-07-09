// components/quiz/QuizCard.jsx
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function QuizCard({ quiz }) {
  const router = useRouter();

  return (
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
  );
}
