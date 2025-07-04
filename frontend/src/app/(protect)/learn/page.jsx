'use client';
import CourseFlowModal from '@/components/CourseFlowModal';
import CourseGenerateModal from '@/components/CourseGenerateModal';
import { getCourses } from '@/services/learn';
import { useQuery } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react';
import { Sparkles, Loader2, BookOpen, Filter, Pencil, BookOpenCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import CourseEditModal from '@/components/CourseEditModal';

export default function LearnPage() {
  const { data, isPending } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
  });
  const router=useRouter();

  const [isCourseGenerateModalOpen, setIsCourseGenerateModalOpen] = useState(false);
  const [isCourseFlowModalOpen, setIsCourseFlowModalOpen] = useState(false);
  const [courseFlowData, setCourseFlowData] = useState(null);
  const [selectedCourseForEdit, setSelectedCourseForEdit] = useState(null);


  // filters
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('Newest');
  const [status, setStatus] = useState('All'); // All, Completed, Pending
  const [difficultyFilter, setDifficultyFilter] = useState('All');

  const filteredCourses = useMemo(() => {
    if (!data?.data) return [];

    return data.data
      .filter((course) =>
        course.topicTitle.toLowerCase().includes(search.toLowerCase())
      )
      .filter((course) => {
        if (difficultyFilter === 'All') return true;
        return course.difficulty?.toLowerCase() === difficultyFilter.toLowerCase();
      })
      .filter((course) => {
        const progress = course.progress?.percentage || 0;
  if (status === 'Completed') return progress >= 90;
  if (status === 'Pending') return progress < 90;
  return true;
      })
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortBy === 'Newest' ? dateB - dateA : dateA - dateB;
      });
  }, [data, search, sortBy, status, difficultyFilter]);

  return (
    <div style={{ padding: '1.5rem', margin: '0rem auto' }} className="max-w-7xl">
      <h1 style={{ marginTop: '1.5rem' }} className="text-4xl font-extrabold text-center text-primary">📚 Learn</h1>
      <p style={{ marginTop: '0.5rem' }} className="text-center text-base-content/70">
        Explore and revisit your personalized learning journeys — grow at your pace, one topic at a time.
      </p>

      <div style={{ marginTop: '1.5rem' }} className="flex justify-center">
        <button
          onClick={() => setIsCourseGenerateModalOpen(true)}
          className="btn btn-primary gap-2"
        >
          <Sparkles size={18} /> Create New Course
        </button>
      </div>

      {/* Filters */}
     <div
  style={{ marginTop: '2rem', padding: '1rem' }}
  className="bg-base-100 border border-base-300 shadow-md rounded-xl"
>
  {/* Title */}
  <div style={{marginBottom:'1rem',padding:'0rem 0.5rem'}} className="flex items-center gap-2">
    <Filter className="w-5 h-5 text-primary" />
    <h2 className="text-lg font-semibold text-primary">Filter Courses</h2>
  </div>

  {/* Filters Grid */}
  <div className="grid md:grid-cols-4 gap-4">
    {/* Search Input */}
    <label className="form-control w-full">
      <div className="label">
        <span className="label-text font-semibold">🔍 Search</span>
      </div>
      <input
        type="text"
        placeholder="Search by course name"
        className="input input-bordered w-full focus:input-primary transition-all duration-200"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </label>

    {/* Sort Dropdown */}
    <label className="form-control w-full">
      <div className="label">
        <span className="label-text font-semibold">📅 Sort By</span>
      </div>
      <select
        className="select select-bordered w-full focus:select-primary transition-all duration-200"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option>Newest</option>
        <option>Oldest</option>
      </select>
    </label>

    {/* Status Filter */}
    <label className="form-control w-full">
      <div className="label">
        <span className="label-text font-semibold">📈 Status</span>
      </div>
      <select
        className="select select-bordered w-full focus:select-primary transition-all duration-200"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="All">All</option>
        <option value="Completed">Completed</option>
        <option value="Pending">Pending</option>
      </select>
    </label>

    {/* Difficulty Filter */}
<label className="form-control w-full">
  <div className="label">
    <span className="label-text font-semibold">🎯 Difficulty</span>
  </div>
  <select
    className="select select-bordered w-full focus:select-primary transition-all duration-200"
    value={difficultyFilter}
    onChange={(e) => setDifficultyFilter(e.target.value)}
  >
    <option value="All">All</option>
    <option value="easy">Easy</option>
    <option value="medium">Medium</option>
    <option value="hard">Hard</option>
  </select>
</label>

  </div>
</div>



      {isPending ? (
        <div style={{ marginTop: '2.5rem' }} className="flex justify-center">
          <Loader2 className="animate-spin w-8 h-8 text-primary" />
        </div>
      ) : filteredCourses.length === 0 ? (
        <p style={{ marginTop: '2.5rem' }} className="text-center text-base-content/70">
          No matching courses found.
        </p>
      ) : (
        <div>
          {/* Course List Title */}
<div style={{marginTop:'3rem',marginBottom:'1rem',padding:'0rem 0.25rem'}} className="flex items-center justify-between">
  <div>
    <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
      <BookOpen className="w-6 h-6" />
      Your Courses
    </h2>
    <p style={{marginTop:'0.25rem'}} className="text-sm text-base-content/70">
      Continue where you left off or explore newly created content.
    </p>
  </div>
</div>

{/* Course Cards Grid */}
<div style={{ marginTop: '2.5rem' }} className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {filteredCourses.map((course, index) => {
    const image = course.image;
    const progressPercentage = course.progress?.percentage || 0;
    const isCompleted = progressPercentage >= 95;
    return (
      <div
        key={course._id}
        className="card bg-base-100 border border-base-300 shadow-md hover:shadow-xl hover:border-primary transition-all duration-300 group relative"
      >
        {course.status === 'pending' && (
  <div
    style={{ padding: '1rem' }}
    className="absolute inset-0 z-30 bg-black/50 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center gap-4 text-base-content"
  >
    {/* Glowing Ring Loader with Animated Book */}
    <div className="relative w-10 h-10">
      <div className="absolute inset-0 flex items-center justify-center">
        <BookOpen
          className="w-10 h-10 text-primary animate-bounce"
        />
      </div>
    </div>

    {/* Animated Text Section */}
    <div className="text-center">
      <p className="text-base font-bold text-primary-content animate-pulse">
        Generating <span className="text-primary">{course.topicTitle}</span> course...
      </p>
      <p className="text-sm text-base-content/70 mt-1 italic">
        📖 Hang tight — your learning journey is being prepared!
      </p>
    </div>
  </div>
)}

        {/* Edit Button */}
        <button
          style={{padding:'0.5rem'}}
          className="absolute rounded-full top-2 z-40 right-2 btn btn-sm btn-ghost bg-base-300 hover:bg-primary hover:text-white transition-all"
          onClick={() => {
            console.log('edit button')
            setSelectedCourseForEdit(course)
          }}
          disabled={course.status === 'pending'}
        >
          <Pencil className="w-4 h-4" />
        </button>

        {/* Image */}
        <figure className="h-40 overflow-hidden">
          <img
            src={image}
            alt="Course"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </figure>

        {/* Content */}
        <div style={{padding:'1rem 0.5rem'}} className="card-body">
          <h2 className="card-title text-xl font-semibold group-hover:text-primary transition-colors duration-200">
            <BookOpen className="w-5 h-5" /> {course.topicTitle}
          </h2>

          <p className="text-sm text-base-content/70">
            {course.numofchapters|| 0} Chapters •{' '}
            {new Date(course.createdAt).toLocaleDateString()}
          </p>

          <div style={{ marginTop: '0.5rem' }}>
            <div style={{ marginBottom: '0.25rem' }} className="flex justify-between text-xs font-semibold text-base-content/60">
              <span>Progress</span>
              <span>{progressPercentage}%</span>
            </div>
            <progress
              className="progress progress-primary w-full"
              value={progressPercentage}
              max="100"
            ></progress>
          </div>

          <div style={{ marginTop: '0.75rem' }} className="flex flex-wrap gap-2">
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
          </div>

          {/* Resume / Completed Button */}
          <div style={{marginTop:'1rem'}}>
            <button
              onClick={() => router.push(`/learn/${course._id}`)}
              className={`btn btn-sm w-full ${
                isCompleted ? 'btn-success' : 'btn-primary'
              }`}
              disabled={course.status === 'pending'}
            >
              {isCompleted ? '✅ Completed' : '🚀 Resume Learning'}
            </button>
          </div>
        </div>
      </div>
    );
  })}
</div>


        </div>
      )}

      {isCourseGenerateModalOpen && (
        <CourseGenerateModal
          setCourseFlowData={setCourseFlowData}
          onOpen={() => setIsCourseFlowModalOpen(true)}
          onClose={() => setIsCourseGenerateModalOpen(false)}
        />
      )}

      {isCourseFlowModalOpen && (
        <CourseFlowModal
          courseFlowData={courseFlowData}
          onClose={() => setIsCourseFlowModalOpen(false)}
        />
      )}
      {selectedCourseForEdit && (
  <CourseEditModal
    setCourseFlowData={setCourseFlowData}
    course={selectedCourseForEdit}
    onCourseFlowOpen={() => setIsCourseFlowModalOpen(true)}
    onClose={() => setSelectedCourseForEdit(null)}
  />
)}
    </div>
  );
}
