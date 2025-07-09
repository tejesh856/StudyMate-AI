'use client';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ResumeSection({ resumeData, isLoading, error }) {
  const router = useRouter();

  if (error) {
    return (
      <div style={{ padding: '1rem' }} className="col-span-full w-full bg-error/10 border border-error rounded-xl flex items-start gap-4 shadow-md animate-fade-in">
        <div style={{ padding: '0.5rem' }} className="bg-error rounded-full text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <div>
          <h3 className="text-error font-bold text-lg">Recent Courses Failed to Load</h3>
          <p className="text-sm text-base-content/70">Oops! Something went wrong while loading your recent learning progress. Try refreshing the page.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return Array(3).fill(0).map((_, idx) => (
      <div key={idx} className="card bg-base-100 border border-base-300 shadow-md animate-pulse">
        <div className="h-40 bg-base-300"></div>
        <div className="card-body flex flex-col gap-2">
          <div className="h-5 bg-base-300 rounded w-3/4"></div>
          <div className="h-3 bg-base-300 rounded w-1/2"></div>
          <div className="h-2.5 bg-base-300 rounded w-full"></div>
          <div className="h-2.5 bg-base-300 rounded w-4/5"></div>
          <div className="flex gap-2 mt-3">
            <div className="h-6 w-20 bg-base-300 rounded"></div>
            <div className="h-6 w-16 bg-base-300 rounded"></div>
          </div>
          <div className="h-8 bg-base-300 rounded w-full mt-2"></div>
        </div>
      </div>
    ));
  }

  if (resumeData?.length > 0) {
    return resumeData.map((course) => {
      const progressPercentage = course.progress?.percentage || 0;
      const isCompleted = progressPercentage >= 95;

      return (
        <div
          key={course.courseId}
          className="card bg-base-100 border border-base-300 shadow-md hover:shadow-xl hover:border-primary transition-all duration-300 group relative"
        >
          <figure className="h-40 overflow-hidden">
            <img
              src={course.image || '/default-course.jpg'}
              alt={course.topicTitle}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </figure>

          <div style={{ padding: '1rem 0.75rem' }} className="card-body">
            <h2 className="card-title text-xl font-semibold group-hover:text-primary transition-colors duration-200">
              <BookOpen className="w-5 h-5" /> {course.topicTitle}
            </h2>

            <p className="text-sm text-base-content/70">
              {course.numofchapters || 0} Chapters • {new Date(course.createdAt).toLocaleDateString()}
            </p>

            <div style={{ marginTop: '0.5rem' }}>
              <div style={{ marginBottom: '0.25rem' }} className="flex justify-between text-xs font-semibold text-base-content/60">
                <span>Progress</span>
                <span>{progressPercentage}%</span>
              </div>
              <progress className="progress progress-primary w-full" value={progressPercentage} max="100"></progress>
            </div>

            <div style={{ marginTop: '0.5rem' }} className="flex flex-wrap gap-2">
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

            <div style={{ marginTop: '1rem' }}>
              <button
                onClick={() => router.push(`/learn/${course.courseId}`)}
                className={`btn btn-sm w-full ${
                  isCompleted ? 'btn-success' : progressPercentage === 0 ? 'btn-accent' : 'btn-primary'
                }`}
                disabled={course.status === 'pending'}
              >
                {isCompleted ? '✅ Completed' : progressPercentage === 0 ? '✨ Start Learning' : '🚀 Resume Learning'}
              </button>
            </div>
          </div>
        </div>
      );
    });
  }

  return (
    <div style={{ padding: '1.5rem' }} className="col-span-full flex flex-col items-center justify-center text-center gap-4 bg-base-100 border border-base-300 rounded-xl shadow-sm animate-fade-in">
      <img src="/course-empty.svg" alt="No Progress" className="w-32 h-32 opacity-60" />
      <h3 className="text-lg font-semibold text-base-content">No Recent Learning</h3>
      <p className="text-sm text-base-content/70 max-w-md">
        You haven't started any courses yet. Once you begin learning, your progress will show up here!
      </p>
      <Link href="/learn" className="btn btn-secondary btn-sm">
        ✨ Explore Courses
      </Link>
    </div>
  );
}
