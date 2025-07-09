'use client';

import React from 'react';
import { Filter } from 'lucide-react';

export default function CourseFilterPanel({
  search,
  setSearch,
  sortBy,
  setSortBy,
  status,
  setStatus,
  difficultyFilter,
  setDifficultyFilter,
}) {
  return (
    <div style={{padding:'1rem'}} className="bg-base-100 border border-base-300 shadow-md rounded-xl">
      <div style={{marginBottom:'1rem', padding:'0rem 0.5rem'}} className="flex items-center gap-2">
        <Filter className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-primary">Filter Courses</h2>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text font-semibold">🔍 Search</span>
          </div>
          <input
            type="text"
            placeholder="Search by course name"
            className="input input-bordered w-full focus:input-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>

        <label className="form-control w-full">
          <div className="label">
            <span className="label-text font-semibold">📅 Sort By</span>
          </div>
          <select
            className="select select-bordered w-full focus:select-primary"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option>Newest</option>
            <option>Oldest</option>
          </select>
        </label>

        <label className="form-control w-full">
          <div className="label">
            <span className="label-text font-semibold">📈 Status</span>
          </div>
          <select
            className="select select-bordered w-full focus:select-primary"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
          </select>
        </label>

        <label className="form-control w-full">
          <div className="label">
            <span className="label-text font-semibold">🎯 Difficulty</span>
          </div>
          <select
            className="select select-bordered w-full focus:select-primary"
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="beginner">🟢 Beginner</option>
              <option value="intermediate">🟡 Intermediate</option>
              <option value="advanced">🔴 Advanced</option>
          </select>
        </label>
      </div>
    </div>
  );
}