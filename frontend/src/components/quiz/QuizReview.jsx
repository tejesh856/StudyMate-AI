'use client';

import { useQuery } from '@tanstack/react-query';
import { GetQuizReview } from '@/services/quiz';
import { useState } from 'react';
import { Brain, Clock, TimerReset, UserCircle2, Copy, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function QuizReview({ id }) {
  const { data, isPending, isError } = useQuery({
    queryKey: ['quiz-review', id],
    queryFn: () => GetQuizReview(id),
    enabled: !!id,
    refetchOnWindowFocus:false
  });

  const [codeVisibility, setCodeVisibility] = useState({});
  const toggleCode = (index) => setCodeVisibility((prev) => ({ ...prev, [index]: !prev[index] }));
  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard!');
  };

  if (isPending) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6 animate-fade-in">
        {/* Glowing Loader Ring + Brain Icon */}
        <div className="relative w-16 h-16">
          <span className="loading loading-ring loading-lg text-primary absolute inset-0 z-0" />
          <Brain className="w-16 h-16 text-primary z-10 relative animate-pulse" />
        </div>

        {/* Text Info */}
        <div className="text-center flex flex-col gap-1">
          <h3 className="text-xl font-bold text-primary">Analyzing Your Quiz Attempt...</h3>
          <p className="text-base-content/70 text-sm">🧠 Fetching insights, scores, and feedback from your session!</p>
        </div>

        {/* Progress Bar */}
        <progress className="progress progress-primary w-64" />
      </div>
    </div>
  );
}

if (isError) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 text-center animate-fade-in">
      {/* Error Icon */}
      <div className="bg-error/10 border border-error p-4 rounded-full shadow-lg">
        <Brain className="w-12 h-12 text-error animate-shake" />
      </div>

      {/* Text Info */}
      <div>
        <h3 className="text-2xl font-bold text-error">Oops! Something went wrong</h3>
        <p style={{marginTop:'0.25rem'}} className="text-base-content/70 text-sm">
          ❌ We couldn't fetch your quiz attempt data.<br />Please try refreshing the page or check your internet.
        </p>
      </div>

      {/* Retry Button */}
      <button
        onClick={() => location.reload()}
        className="btn btn-error btn-outline gap-2"
      >
        🔄 Retry
      </button>
    </div>
  );
}


  const attemptData = data?.success && data?.attempts?.length > 0 ? data.attempts[0] : null;
if (!attemptData) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 text-center animate-fade-in">
      {/* Icon with glow */}
      <div className="relative">
        <div className="bg-warning/10 border border-warning p-4 rounded-full shadow-md">
          <Brain className="w-14 h-14 text-warning animate-pulse" />
        </div>
        <span className="loading loading-dots loading-sm text-warning absolute -top-3 -right-3"></span>
      </div>

      {/* Message */}
      <div>
        <h3 className="text-2xl font-bold text-warning">No Attempt Found</h3>
        <p style={{marginTop:'0.25rem'}} className="text-base-content/70 text-sm">
          😕 It looks like you haven’t attempted this quiz yet, or something went wrong saving your attempt.
        </p>
      </div>

      {/* Action Suggestion */}
      <button
        onClick={() => window.history.back()}
        className="btn btn-outline btn-warning gap-2"
      >
        🔙 Go Back
      </button>
    </div>
  );
}

  const {
    quizId,
    mcqAnswers,
    codeAnswers,
    totalscore: overallScore,
    mcqscore: mcqScore,
    codingscore: codingScore,
    userId,
    startTime,
    review,
  } = attemptData;

  const mcqQuestions = quizId.mcqs || [];
  const codingQuestions = quizId.coding || [];

  const mcqPercentage = mcqQuestions.length ? Math.round((mcqScore / mcqQuestions.length) * 100) : 0;
  const codingPercentage = codingQuestions.length ? Math.round((codingScore / codingQuestions.length) * 100) : 0;
  const totalQuestions = mcqQuestions.length + codingQuestions.length;
  const overallPercentage = totalQuestions ? Math.round((overallScore / totalQuestions) * 100) : 0;

  return (
    <div style={{ padding: '1.5rem' }} className="max-w-6xl mx-auto">
      {/* Header */}
      <div style={{marginBottom:'2.5rem',paddingBottom:'1.5rem'}} className="border-b">
        <h2 style={{marginBottom:'1rem'}} className="text-4xl font-bold flex items-center gap-3 text-primary">
          <Brain size={38} /> Quiz Review
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-base">
          <div className="flex items-center gap-2">
            <UserCircle2 className="text-info" /> <span><strong>User:</strong> {userId?.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="text-warning" /> <span><strong>Start Time:</strong> {new Date(startTime).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <TimerReset className="text-accent" /> <span><strong>Duration:</strong> {quizId.duration} mins</span>
          </div>
        </div>

        <div style={{marginTop:'1rem'}} className=" flex flex-wrap gap-3">
          <div className="badge badge-primary badge-lg">Topic: {quizId.topic}</div>
          <div className={`badge badge-lg text-white ${quizId.difficulty === 'easy' ? 'badge-success' : quizId.difficulty === 'medium' ? 'badge-warning' : 'badge-error'}`}>
            Difficulty: {quizId.difficulty}
          </div>
          <div className="badge badge-accent badge-lg">📊 Overall: {overallScore}/{totalQuestions} ({overallPercentage}%)</div>
        </div>
      </div>

      {/* MCQ Section */}
      <section style={{marginBottom:'4rem'}}>
        <div style={{marginBottom:'1.5rem',paddingBottom:'0.5rem'}} className="flex justify-between items-center border-b">
          <h3 className="text-2xl font-semibold">📝 MCQ Questions</h3>
          <span className="badge badge-success badge-lg">✅ {mcqScore} / {mcqQuestions.length} ({mcqPercentage}%)</span>
        </div>

        <div className="flex flex-col gap-12">
          {mcqQuestions.map((q, i) => {
            const userAnswer = mcqAnswers?.[q._id];
            const isCorrect = userAnswer === q.answer;

            return (
              <div key={q._id} style={{padding:'1.25rem'}} className="card bg-base-100 shadow-md border rounded-lg flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-lg">{i + 1}. {q.question}</h4>
                  <div className={`badge ${isCorrect ? 'badge-success' : userAnswer ? 'badge-error' : 'badge-warning'} text-white`}>
                    {isCorrect ? '✔️ Correct' : userAnswer ? '❌ Incorrect' : '⚠️ Unanswered'}
                  </div>
                </div>

                <ul className="flex flex-col gap-2">
                  {q.options.map((opt, j) => {
                    const isUserAnswer = opt === userAnswer;
                    const isCorrectAnswer = opt === q.answer;

                    return (
                      <li key={j} style={{padding:'0.75rem'}} className={`rounded-md flex justify-between items-center text-sm border
                        ${isCorrectAnswer
                          ? 'bg-success/20 border-success'
                          : isUserAnswer
                            ? 'bg-error/20 border-error'
                            : 'bg-base-200 border-base-300'}`}>
                        <span>{opt}</span>
                        <div className="flex gap-2">
                          {isCorrectAnswer && <span className="badge badge-success text-xs">✅ Correct</span>}
                          {isUserAnswer && (
                            <span className={`badge text-xs ${isCorrectAnswer ? 'badge-success' : 'badge-error'}`}>
                              🎯 Your Answer
                            </span>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>

                {!userAnswer && (
                  <div style={{marginTop:'0.5rem'}} className="alert alert-warning text-sm">
                    ⚠️ You did not answer this question.
                  </div>
                )}
                {review?.mcqComments?.[q._id] && (
  <div style={{marginTop:'1rem'}}>
    <details style={{padding:'0.5rem'}} className="collapse collapse-arrow border border-info bg-info/10 rounded-box shadow-md">
      <summary className="collapse-title text-info font-medium text-base flex items-center gap-2">
        <span className="text-xl">💡</span> AI Explanation & Concept Review
        <span style={{marginLeft:'1rem',padding:'0.25rem'}} className="badge badge-outline badge-info text-xs">MCQ Insight</span>
      </summary>
      <div style={{paddingTop:'1rem'}} className="collapse-content">
        <div className="prose max-w-none prose-sm sm:prose-base text-base-content whitespace-pre-line leading-relaxed">
          {review.mcqComments[q._id]}
        </div>
      </div>
    </details>
  </div>
)}

              </div>
            );
          })}
           
        </div>
      </section>

      {/* Coding Section */}
      {codingQuestions.length > 0 && (
        <section style={{marginBottom:'2.5rem'}} >
          <div style={{marginBottom:'1.5rem',paddingBottom:'0.5rem'}} className="flex justify-between items-center border-b">
            <h3 className="text-2xl font-semibold">💻 Coding Questions</h3>
            <span className="badge badge-info badge-lg">💻 {codingScore} / {codingQuestions.length} ({codingPercentage}%)</span>
          </div>

          <div className="flex flex-col gap-10">
            {codingQuestions.map((q, i) => {
              const userCode = codeAnswers?.[q.title] || null;
              const showCode = codeVisibility[i] || false;
              const codeReview = review?.codingFeedback?.find((r) => r.questionId === q._id);

              return (
                <div key={q._id} style={{padding:'1.25rem'}} className="card border bg-base-100 shadow-md rounded-lg">
                  <div className="card-body flex flex-col gap-4">
                    <h4 className="text-lg font-semibold">{i + 1}. {q.title}</h4>
                    <p><strong>📝 Description:</strong> {q.description}</p>
                    <p><strong>📌 Constraints:</strong> {q.constraints}</p>
                    {q.inputFormat && <p><strong>🔢 Input Format:</strong> {q.inputFormat}</p>}
                    {q.outputFormat && <p><strong>📤 Output Format:</strong> {q.outputFormat}</p>}
                    {q.sampleInput && <p><strong>📥 Sample Input:</strong> <code className="bg-base-200 px-2 py-1 rounded">{q.sampleInput}</code></p>}
                    {q.sampleOutput && <p><strong>📤 Sample Output:</strong> <code className="bg-base-200 px-2 py-1 rounded">{q.sampleOutput}</code></p>}

                    {/* Toggle and Copy */}
                    <div style={{marginTop:'1rem'}}>
                      <div className="flex justify-between items-center">
                        <h5 className="font-semibold">🧠 Your Solution</h5>
                        {userCode && (
                          <button
                            onClick={() => toggleCode(i)}
                            className="btn btn-sm bg-primary text-white gap-2"
                          >
                            {showCode ? <EyeOff size={16} /> : <Eye size={16} />}
                            {showCode ? 'Hide Code' : 'Show Code'}
                          </button>
                        )}
                      </div>

                      {userCode ? (
                        <div
                          style={{
                            maxHeight: showCode ? '1000px' : '0px',
                            overflow: 'hidden',
                            transition: 'max-height 0.4s ease-in-out',
                          }}
                        >
                          <div style={{marginTop:'0.5rem'}} className="relative border rounded">
                            <button
                              onClick={() => handleCopy(userCode)}
                              className="absolute right-3 top-3 btn btn-xs btn-outline btn-info flex gap-1"
                            >
                              <Copy size={14} /> Copy
                            </button>

                            <SyntaxHighlighter
                              language="python"
                              style={oneDark}
                              wrapLongLines
                              customStyle={{
                                padding: '1rem',
                                fontSize: '0.9rem',
                                margin: 0,
                                backgroundColor: 'transparent',
                              }}
                            >
                              {userCode}
                            </SyntaxHighlighter>
                          </div>
                        </div>
                      ) : (
                        <div style={{marginTop:'0.5rem'}} className="alert alert-warning text-sm">
                          ⚠️ You did not submit a solution for this coding question.
                        </div>
                      )}
                    </div>

                    {/* Feedback */}
                   {codeReview?.feedback && showCode && (
  <div style={{ marginTop: '1.5rem' }}>
    <details style={{ padding: '1rem' }} className="collapse collapse-arrow border border-info bg-info/10 rounded-box shadow-lg">
      <summary className="collapse-title text-lg font-semibold text-info flex items-center gap-2">
        <span className="text-xl">💡</span> AI Coding Feedback & Improvements
        <span style={{marginLeft:'1rem',padding:'0.25rem'}} className="badge badge-outline badge-info text-xs">Auto-Review</span>
      </summary>
      <div style={{paddingTop:'1rem'}} className="collapse-content">
        <div className="prose max-w-none prose-sm sm:prose-base text-base-content whitespace-pre-line leading-relaxed">
          {codeReview.feedback}
        </div>
      </div>
    </details>
  </div>
)}


                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Overall Comments */}
      {/* Overall Comments */}
{review?.overallComments && (
  <div style={{marginTop:'3rem'}}>
    <div className="card bg-base-100 shadow-xl border border-info">
      <div style={{padding:'1.5rem 2rem'}} className="card-body flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h4 className="text-2xl font-bold text-info flex items-center gap-2">
            🧠 Overall AI Feedback
          </h4>
          <span className="badge badge-outline badge-info text-xs">✨ Insightful Summary</span>
        </div>

        <div className="divider before:bg-info after:bg-info text-info text-sm font-semibold">
          📘 Feedback Breakdown
        </div>

        <details className="collapse collapse-arrow border border-info bg-info/5 rounded-box">
          <summary style={{padding:'0.5rem'}} className="collapse-title text-base-content font-medium text-base flex items-center gap-2">
            <span className="text-info">💬</span> Click to read AI-generated overall review
          </summary>
          <div style={{padding:'0.75rem',}} className="collapse-content">
            <div className="prose max-w-none prose-sm sm:prose-base text-base-content whitespace-pre-line leading-relaxed">
              {review.overallComments}
            </div>

            {/* Suggestion Tags */}
            <div style={{marginTop:'1.5rem'}} className="flex flex-wrap gap-2">
              <span className="badge badge-accent badge-outline text-xs">🎯 Practice Tips</span>
              <span className="badge badge-secondary badge-outline text-xs">🚀 Recommended Topics</span>
              <span className="badge badge-success badge-outline text-xs">📈 Areas to Improve</span>
              <span className="badge badge-warning badge-outline text-xs">🧪 Common Mistakes</span>
            </div>
          </div>
        </details>
      </div>
    </div>
  </div>
)}



    </div>
  );
}
