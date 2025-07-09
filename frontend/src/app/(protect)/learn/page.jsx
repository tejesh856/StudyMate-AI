'use client';

import { getCourses } from '@/services/learn';
import { useQuery } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react';
import { Sparkles, BookOpen,BookOpenCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useCourseStore from '@/store/useCourseStore';
import dynamic from 'next/dynamic';
import EmptyState from '@/components/EmptyState';
import PendingState from '@/components/PendingState';
import ErrorState from '@/components/ErrorState';
import CourseFilterPanel from '@/components/learn/CourseFilterPannel';
import CourseCard from '@/components/learn/CourseCard';

const CourseFlowModal = dynamic(() => import('@/components/learn/CourseFlowModal'), {
  ssr: false,
});
const CourseGenerateModal = dynamic(() => import('@/components/learn/CourseGenerateModal'), {
  ssr: false,
});
const CourseEditModal = dynamic(() => import('@/components/learn/CourseEditModal'), {
  ssr: false,
});

export default function LearnPage() {
  const { data, isPending,isError,refetch } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
    refetchOnWindowFocus: false,
  });
  const router=useRouter();

  const {
    isCourseGenerateModalOpen,
    setIsCourseGenerateModalOpen,
    isCourseFlowModalOpen,
    setIsCourseFlowModalOpen,
    selectedCourseForEdit,
    setSelectedCourseForEdit,
    courseFlowData,
    setCourseFlowData
  } = useCourseStore();


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
      <CourseFilterPanel
  search={search}
  setSearch={setSearch}
  sortBy={sortBy}
  setSortBy={setSortBy}
  status={status}
  setStatus={setStatus}
  difficultyFilter={difficultyFilter}
  setDifficultyFilter={setDifficultyFilter}
/>

     



      {isPending ? (
  <PendingState
    title="Loading Your Courses..."
    subtitle="📚 Your personalized learning space is on the way!"
  icon={<BookOpenCheck className="w-full h-full text-primary animate-bounce" />}

  />
) : isError ? (
  <ErrorState
    icon={<BookOpen className='w-full h-full text-error'/>}
    title="Failed to Load Courses"
    message="Oops! Something went wrong while fetching your courses. Please try again."
    onRetry={refetch}
    retryLabel="Retry"
  />
) : filteredCourses.length === 0 ? (
  <EmptyState
  image="/course-empty.svg"
  title="No Courses Found"
  description="You haven’t created any courses yet. Start your learning journey now!"
  buttonLabel="Create Your First Course"
  onClick={() => setIsCourseGenerateModalOpen(true)}
/>

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
  {filteredCourses.map((course) => {
    return(
      <CourseCard
    key={course._id}
    course={course}
    onEdit={(course) => setSelectedCourseForEdit(course)}
    onResume={(id) => router.push(`/learn/${id}`)}
  />
    )    
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
