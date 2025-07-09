'use client';

import Navigation from "@/components/learn/Navigation";
import SubChapterCard from "@/components/learn/SubChapterCard";
import { getCourse, markSubChapterComplete, updateProgress } from "@/services/learn";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function StudyMaterialPage() {
  const { id: courseId } = useParams();
  const queryClient = useQueryClient();

  const { data, isPending, error } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => getCourse(courseId),
    enabled: !!courseId,
    refetchOnWindowFocus: false,
  });

  const { mutate: updateProgressTrigger } = useMutation({
  mutationFn: updateProgress,
  onError: () => toast.error("Failed to update course progress"),
});



  const {mutate:markSubChapterTrigger,isPending:ismarkSubChapterPending}=useMutation({
    mutationFn: markSubChapterComplete,
    onError:(err)=>{
      toast.error("Failed to mark subchapter.");

    }
  })



  const course = data?.data;
  const chapters = course?.chapters || [];
  const [currentChapterIdx, setCurrentChapterIdx] = useState(0);
  const [completedSubChapters, setCompletedSubChapters] = useState([]);
  useEffect(() => {
  if (course?.progress?.completedSubChapters) {
    setCompletedSubChapters(course.progress.completedSubChapters);
  }
}, [course]);


  const currentChapter = chapters[currentChapterIdx];

  const handlePrev = () => setCurrentChapterIdx((i) => Math.max(i - 1, 0));
  const handleNext = () => setCurrentChapterIdx((i) => Math.min(i + 1, chapters.length - 1));
  const handleMarkSubChapter = (subChapterId) => {
  markSubChapterTrigger(
    { courseId, subChapterId },
    {
      onSuccess: () => {
        toast.success("Marked as completed!");
        setCompletedSubChapters((prev) => [...prev, subChapterId]);
        updateProgressTrigger({
          courseId,
          chapterIdx: currentChapterIdx,
          subChapterId,
        });
        queryClient.invalidateQueries({ queryKey: ['stats'] });
        queryClient.invalidateQueries({ queryKey: ['resume-progress'] });
      },
    }
  );
};


if (isPending) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 animate-spin rounded-full border-t-4 border-b-4 border-primary"></div>
        <div className="absolute inset-4 rounded-full bg-base-100 flex items-center justify-center shadow-md">
          <span className="text-3xl">📘</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-lg font-semibold text-primary animate-pulse">Loading Study Materials...</p>
        <p className="text-sm text-base-content/70 italic">Please wait while we fetch your course.</p>
      </div>
    </div>
  );
}
  if (error) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
      <div className="text-error">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 animate-bounce"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01M5.5 4.5l13 13m-13 0l13-13M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-error">Oops! Something went wrong</h2>
        <p className="text-base-content/70 mt-2 italic">We couldn't load your course. Please try again later.</p>
      </div>
      <button
        className="btn btn-outline btn-error"
        onClick={() => window.location.reload()}
      >
        🔄 Retry
      </button>
    </div>
  );
}

  
  return (
  <div style={{ padding: '2rem', margin: '0 auto' }} className="max-w-8xl">
    <h1 style={{ marginBottom: '2rem' }} className="text-4xl font-bold text-primary text-center">
      {course.topicTitle}
    </h1>

    {/* Grid layout: TOC and Content */}
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      
      {/* Table of Contents */}
      <aside className="lg:col-span-1 sticky top-24 h-fit">
  <div
    style={{ padding: '1.25rem' }}
    className="bg-base-100 border border-base-300 rounded-xl shadow-md"
  >
    <h2
      style={{ marginBottom: '1rem' }}
      className="text-2xl font-bold text-secondary flex items-center justify-between gap-2 whitespace-nowrap"
    >
      <span className="truncate">📚 {course.topicTitle}</span>
      <span
        style={{ padding: '0.5rem' }}
        className="badge badge-accent badge-outline text-xs whitespace-nowrap"
      >
        Chapters: {chapters.length}
      </span>
    </h2>


          <ul style={{ padding: '0.5rem' }} className="menu bg-base-200 rounded-box flex flex-col gap-1">
            {chapters.map((chapter, idx) => (
              <li key={idx}>
                <button
                  style={{ padding: '0.75rem' }}
                  onClick={() => setCurrentChapterIdx(idx)}
                  className={`flex items-start gap-3 text-left rounded-lg transition-all duration-200 ${
                    idx === currentChapterIdx
                      ? 'bg-primary text-primary-content font-semibold shadow-inner'
                      : 'hover:bg-base-300 hover:text-primary'
                  }`}
                >
                  <span style={{ padding: '0.25rem' }} className="badge badge-secondary badge-outline">{idx + 1}</span>
                  <div>
                    <span className="block font-medium">Chapter {idx + 1}</span>
                    <span className="text-sm opacity-70">{chapter.title}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:col-span-3">
        <Navigation
          currentChapterIdx={currentChapterIdx}
          handlePrev={handlePrev}
          handleNext={handleNext}
          currentChapter={currentChapter}
          chapters={chapters}
        />

        <p style={{ marginBottom: '2rem' }} className="text-base-content/80 text-justify">
          {currentChapter.description}
        </p>

        <div className="flex flex-col gap-10">
          {currentChapter.subChapters?.map((sub, index) => (
            <SubChapterCard
              key={sub._id}
              sub={sub}
              chapterNumber={currentChapterIdx + 1}
              index={index}
              onMarkSubChapter={handleMarkSubChapter}
              isCompleted={completedSubChapters.includes(sub._id)}

            />
          ))}
        </div>
      </main>
    </div>
  </div>
);

}
