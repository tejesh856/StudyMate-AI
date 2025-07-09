// components/quiz/QuizFilterPanel.jsx
'use client';
import React from 'react';

export default function QuizFilterPanel({ filters, setFilters, sortOrder, setSortOrder }) {
  return (
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
  );
}
