'use client';
import React from 'react';
import { BookOpen, Pencil } from 'lucide-react';

export default function CourseCard({ course, onEdit, onResume }) {
  const progressPercentage = course.progress?.percentage || 0;
  const isCompleted = progressPercentage >= 95;

  return (
    <div className="card bg-base-100 border border-base-300 shadow-md hover:shadow-xl hover:border-primary transition-all duration-300 group relative">
      {/* Pending Overlay */}
      {course.status === 'pending' && (
        <div className="absolute inset-0 z-30 bg-black/50 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center gap-4">
          <BookOpen className="w-10 h-10 text-primary animate-bounce" />
          <p className="text-base font-bold text-primary-content animate-pulse">
            Generating <span className="text-primary">{course.topicTitle}</span>...
          </p>
          <p className="text-sm text-base-content/70 italic">
            📖 Hang tight — your learning journey is being prepared!
          </p>
        </div>
      )}

      {/* Edit Button */}
      <button
        className="absolute top-2 right-2 z-40 btn btn-sm btn-ghost bg-base-300 hover:bg-primary hover:text-white"
        onClick={() => onEdit(course)}
        disabled={course.status === 'pending'}
      >
        <Pencil className="w-4 h-4" />
      </button>

      {/* Image */}
      <figure className="h-40 overflow-hidden">
        <img
          src={course.image || '/default-course.jpg'}
          alt="Course"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </figure>

      {/* Content */}
      <div style={{padding:'1rem 0.75rem'}} className="card-body">
        <h2 className="card-title text-xl font-semibold group-hover:text-primary transition-colors duration-200">
          <BookOpen className="w-5 h-5" /> {course.topicTitle}
        </h2>
        <p className="text-sm text-base-content/70">
          {course.numofchapters || 0} Chapters • {new Date(course.createdAt).toLocaleDateString()}
        </p>

        {/* Progress */}
        <div style={{marginTop:'0.5rem'}}>
          <div style={{marginBottom:'0.25rem'}} className="flex justify-between text-xs font-semibold text-base-content/60">
            <span>Progress</span>
            <span>{progressPercentage}%</span>
          </div>
          <progress
            className="progress progress-primary w-full"
            value={progressPercentage}
            max="100"
          ></progress>
        </div>

        {/* Tags */}
        <div style={{marginTop:'0.5rem'}} className="flex flex-wrap gap-2">
          <div className="badge badge-success badge-outline">
            {course.numofchapters || 0} Chapters
          </div>
          {course.difficulty && (
            <div
              className={`badge badge-outline ${
                course.difficulty === 'easy'
                  ? 'badge-success'
                  : course.difficulty === 'medium'
                  ? 'badge-warning'
                  : 'badge-error'
              }`}
            >
              {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
            </div>
          )}
          {course.subject && (
            <div className="badge badge-outline badge-info">{course.subject}</div>
          )}
        </div>

        {/* Action Button */}
        <button
        style={{marginTop:'1rem'}}
          onClick={() => onResume(course._id)}
          className={`btn btn-sm w-full ${
            isCompleted
              ? 'btn-success'
              : progressPercentage === 0
              ? 'btn-accent'
              : 'btn-primary'
          }`}
          disabled={course.status === 'pending'}
        >
          {isCompleted
            ? '✅ Completed'
            : progressPercentage === 0
            ? '✨ Start Learning'
            : '🚀 Resume Learning'}
        </button>
      </div>
    </div>
  );
}
