"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useQuizStore from "@/store/useQuizStore";
import { GetQuiz, GetQuizTemplate } from "@/services/quiz";
import Editor from "@monaco-editor/react"; // Make sure monaco-editor and @monaco-editor/react are installed
import { useThemeStore } from "@/store/useThemeStore";
import MCQQuestion from "@/components/quiz/attempt/MCQQuestion";
import QuizNavigation from "@/components/quiz/attempt/QuizNavigation";
import CodingQuestion from "@/components/quiz/attempt/CodingQuestion";
import QuizHeader from "@/components/quiz/attempt/QuizHeader";

export default function QuizAttemptPage() {
  const { id: quizId } = useParams();
  const queryClient = useQueryClient();
  const {theme}=useThemeStore();
  const router = useRouter();
  const [templateCode, setTemplateCode] = useState("");


  const { data, isPending } = useQuery({
    queryKey: ["quiz", quizId],
    queryFn: GetQuiz,
    refetchOnWindowFocus: false,
  });

  //useMutation to get template
  const { isPending: isTemplatePending, mutate: getTemplateTrigger } = useMutation({
    mutationFn: GetQuizTemplate,
    onSuccess: (data) => {
      setTemplateCode(data.template);
    },
    onError: (error) => {
      toast.error("Failed to load template");
      console.error("Error fetching template:", error);
    },
  });

  const {
    connectSocket,
    resetQuiz,
    startQuiz,
    setQuizData,
    quizData: quiz,
    restoreAttempt,
    setCurrentIndex,
    setAnswer,
    setCodeAnswer,
    currentIndex,
    selectedAnswers,
    codeAnswers,
    formattedTime,
    submitQuiz,
    submitted,
    updateProgress,
    setCodeResults,
    setSelectedLanguage,
    selectedLanguage,
    codeResults,
    runCode
  } = useQuizStore();

  useEffect(() => {
    if (!data?.quiz) return;
      resetQuiz();
      setQuizData(data.quiz);
      connectSocket();
      startQuiz({ quizId: data.quiz._id, userId: data.quiz.studentId });
      restoreAttempt({ quizId: data.quiz._id, userId: data.quiz.studentId });
      if (data.quiz.codingLanguages?.length > 0) {
        const firstLang = data.quiz.codingLanguages[0];
        setSelectedLanguage(data.quiz.codingLanguages[0]);
        getTemplateTrigger({
          language: firstLang.language,
          version: firstLang.version,
        });
      }

    
  }, [data]);

  useEffect(() => {
    const autosave = setInterval(() => updateProgress(), 30000);
    return () => clearInterval(autosave);
  }, []);

  useEffect(() => {
    if (submitted) {
      const timeout = setTimeout(() => {
        resetQuiz();
        router.push("/quiz");
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [submitted]);

  if (isPending || quiz?._id !== quizId) {
  return (
    <div style={{padding:'0rem 1rem'}} className="flex flex-col items-center justify-center min-h-screen bg-base-100 gap-6 text-center">
      {/* Glowing Loader Ring */}
      <div className="relative">
        <span className="loading loading-ring loading-lg text-primary"></span>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl animate-pulse">📘</span>
        </div>
      </div>

      {/* Animated Text */}
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-primary animate-pulse">
          Loading Your Quiz...
        </h2>
        <p className="text-base text-base-content/70">
          Setting up your personalized questions. Please wait patiently. 🧠💡
        </p>
      </div>

      {/* Progress Bar */}
      <progress className="progress progress-primary w-64 animate-pulse" />
    </div>
  );
}


  const totalQuestions = quiz.mcqs.length + quiz.coding.length;
  const isCoding = currentIndex === quiz.mcqs.length;
  const codingQ = isCoding ? quiz.coding[0] : null;
  const question = !isCoding ? quiz.mcqs[currentIndex] : null;

  return (
    <div style={{padding:'1.5rem 2.5rem'}} className="min-h-screen bg-base-200 flex flex-col items-center gap-6">
      {/* Progress bar */}
      <progress
        className="progress progress-primary w-full max-w-3xl"
        value={currentIndex + 1}
        max={totalQuestions}
      />

      <div style={{padding:'1.5rem'}} className="w-full max-w-3xl bg-base-100 rounded-xl shadow-xl flex flex-col gap-6">
        {/* Header */}
        <QuizHeader formattedTime={formattedTime} currentIndex={currentIndex} totalQuestions={totalQuestions} />


        {submitted && (
          <div className="alert alert-success shadow-sm">
            ✅ Quiz submitted. Redirecting...
          </div>
        )}

        {/* Question Rendering */}
        {!isCoding ? (
          <MCQQuestion
            question={question}
            currentIndex={currentIndex}
            selectedAnswers={selectedAnswers}
            setAnswer={setAnswer}
          />
          
        ) : (
          <CodingQuestion
            codingQ={codingQ}
            quiz={quiz}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            getTemplateTrigger={getTemplateTrigger}
            isTemplatePending={isTemplatePending}
            theme={theme}
            codeAnswers={codeAnswers}
            setCodeAnswer={setCodeAnswer}
            runCode={runCode}
            codeResults={codeResults}
            templateCode={templateCode}
          />
          

        )}

        {/* Navigation & Submission */}
        <QuizNavigation
          currentIndex={currentIndex}
          totalQuestions={totalQuestions}
          setCurrentIndex={setCurrentIndex}
          submitQuiz={submitQuiz}
          queryClient={queryClient}
        />
      </div>
    </div>
  );
}