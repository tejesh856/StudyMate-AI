'use client';

import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useCourseStore from '@/store/useCourseStore';

export default function SuggestionsSection({ suggestions, isLoading }) {
  const router = useRouter();
  const { setSuggestionPayload, setIsCourseFlowModalOpen } = useCourseStore();

  const groupedSuggestions = [
    { type: 'reviewQuiz', title: '📘 Review Quizzes' },
    { type: 'attemptQuiz', title: '📝 New Quizzes to Attempt' },
    { type: 'newCourse', title: '📚 Suggested New Courses' },
  ];

  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <h2 style={{ marginBottom: '1rem' }} className="text-xl font-semibold flex items-center gap-2">
        <Sparkles className="text-secondary" /> AI Suggestions for You
      </h2>

       {!isLoading && suggestions?.length > 0 ? (
        <div className="flex flex-col gap-6">
          {groupedSuggestions.map(({ type, title }) => {
            const group = suggestions.filter((s) => s.type === type);
            if (group.length === 0) return null;

            return (
              <div key={type}>
                <h3 style={{ marginBottom: '0.5rem' }} className="text-lg font-semibold">
                  {title}
                </h3>
                <ul style={{ marginLeft: '1.5rem' }} className="list-disc flex flex-col gap-2 text-base-content">
                  {group.map((sugg) => (
                    <li key={sugg._id}>
                      {sugg.text.replace(sugg.highlightText, '')}
                      <span className="font-semibold text-primary">
                        <button
                          onClick={() => {
                            if (sugg.type === 'newCourse') {
                              setSuggestionPayload({
                                topic: sugg.topic,
                                description: sugg.description,
                                difficulty: sugg.difficulty,
                                numofchapters: Number(sugg.numofchapters),
                                includevideo: sugg.includeVideo,
                              });
                              router.push('/learn');
                              setIsCourseFlowModalOpen(true);
                            } else {
                              router.push(sugg.link);
                            }
                          }}
                          className="hover:underline"
                        >
                          {' '}
                          {sugg.highlightText}
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          style={{ padding: '1.5rem' }}
          className="w-full flex flex-col items-center justify-center text-center gap-4 p-6 bg-base-100 border border-base-300 rounded-xl shadow-sm animate-fade-in"
        >
          <img src="/empty-suggest.svg" alt="No Suggestions" className="w-28 h-28 opacity-60" />
          <h3 className="text-lg font-semibold text-base-content">No AI Suggestions Yet</h3>
          <p className="text-sm text-base-content/70 max-w-md">
            Looks like there are no AI suggestions at the moment. As you learn and take quizzes, personalized tips will appear here!
          </p>
          <Link href="/learn" className="btn btn-outline btn-secondary btn-sm">
            🔍 Explore Courses
          </Link>
        </div>
      )}
    </div>
  );
}
