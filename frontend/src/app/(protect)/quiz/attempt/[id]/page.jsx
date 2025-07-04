"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useQuizStore from "@/store/useQuizStore";
import { GetQuiz, GetQuizTemplate } from "@/services/quiz";
import Editor from "@monaco-editor/react"; // Make sure monaco-editor and @monaco-editor/react are installed
import { useThemeStore } from "@/store/useThemeStore";

export default function QuizAttemptPage() {
  const { id: quizId } = useParams();
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
      console.log("Template fetched successfully:", data);
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
    if (data) {
      resetQuiz();
      setQuizData(data.quiz);
      connectSocket();
      startQuiz({ quizId: data.quiz._id, userId: data.quiz.studentId });
      restoreAttempt({ quizId: data.quiz._id, userId: data.quiz.studentId });
      if (data.quiz.codingLanguages?.length > 0) {
        setSelectedLanguage(data.quiz.codingLanguages[0]);
        const firstLang = data.quiz.codingLanguages[0];
        getTemplateTrigger({
          language: firstLang.language,
          version: firstLang.version,
        });
      }

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

  if (isPending || !quiz || quiz._id !== quizId) {
    return <div className="text-center text-lg py-10">⏳ Loading quiz...</div>;
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
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-primary">⏳ Time Left: {formattedTime}</h2>
          <span className="badge badge-outline badge-primary">
            Question {currentIndex + 1} / {totalQuestions}
          </span>
        </div>

        {submitted && (
          <div className="alert alert-success shadow-sm">
            ✅ Quiz submitted. Redirecting...
          </div>
        )}

        {/* Question Rendering */}
        {!isCoding ? (
          <div className="card border border-base-300 bg-base-100">
            <div className="card-body flex flex-col gap-4">
              <h3 className="text-lg font-semibold">
                {currentIndex + 1}. {question?.question}
              </h3>
              <ul className="flex flex-col gap-3">
                {question?.options?.map((opt, j) => {
                  const isSelected = selectedAnswers[question._id] === opt;
                  return (
                    <li key={j}>
                      <label
                      style={{padding:'1rem'}}
                        className={`flex items-center gap-3 border rounded-lg cursor-pointer transition-all ${
                          isSelected ? "border-primary bg-primary/10" : "hover:bg-base-200 border-base-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`q-${question._id}`}
                          value={opt}
                          checked={isSelected}
                          onChange={() => setAnswer(question._id, opt)}
                          className="radio radio-primary"
                        />
                        <span className="text-base">{opt}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        ) : (
          <div className="card border border-base-300 bg-base-100">
  <div className="card-body flex flex-col gap-4">
    <h3 className="text-lg font-semibold">{codingQ?.title}</h3>
    <p>{codingQ?.description}</p>
    <div className="text-sm flex flex-col gap-2">
      <p><strong>Input Format:</strong> {codingQ?.inputFormat}</p>
      <p><strong>Output Format:</strong> {codingQ?.outputFormat}</p>
      <p><strong>Constraints:</strong> {codingQ?.constraints}</p>
      <p><strong>Sample Input:</strong> {codingQ?.sampleInput}</p>
      <p><strong>Sample Output:</strong> {codingQ?.sampleOutput}</p>
    </div>

    <div className="flex justify-between items-center gap-4">
     <select
  className="select select-bordered"
  value={selectedLanguage ? JSON.stringify(selectedLanguage) : ""}
 onChange={(e) => {
    const val = e.target.value;
    if (!val) return;
    const langObj = JSON.parse(val);
    setSelectedLanguage(langObj);
    getTemplateTrigger({
      language: langObj.language,
      version: langObj.version,
    });
  }}
>
  {quiz?.codingLanguages?.map((lang, i) => (
    <option key={i} value={JSON.stringify(lang)}>
      {lang.language} ({lang.version})
    </option>
  ))}
</select>



      <button
        className="btn btn-primary"
        onClick={() =>
          runCode({
              quizId: quiz._id,
              userId: quiz.studentId,
              questionId: codingQ._id,
              code: codeAnswers[codingQ.title] || "",
            })
        }
      >
        ▶ Run Code
      </button>
    </div>
    <div className="relative">
  {isTemplatePending && (
    <div className="absolute inset-0 z-10 bg-base-200 bg-opacity-80 flex items-center justify-center rounded-lg">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  )}

  <Editor
    height="300px"
    defaultLanguage={selectedLanguage?.language}
    language={selectedLanguage?.language}
    theme={`vs-${theme}`}
    value={codeAnswers[codingQ?.title] || templateCode}
    onChange={(val) => setCodeAnswer(codingQ.title, val || "")}
    options={{
      readOnly: isTemplatePending,
    }}
  />
</div>


    {/* Show Test Case Results */}
   <div style={{ marginTop: "1.5rem" }}>
  <h4 style={{ marginBottom: "1rem" }} className="text-lg font-bold text-primary">
    🧪 Test Case Results
  </h4>

  {codeResults[codingQ._id]?.length ? (
    <ul className="flex flex-col gap-4">
      {codeResults[codingQ._id].map((test, i) => (
        <li
          key={i}
          className={`card shadow-md transition-transform duration-200 hover:scale-[1.02] ${
            test.passed ? "border-success bg-success/20" : "border-error bg-error/20"
          }`}
        >
          <div style={{ padding: "1rem" }} className="card-body">
            <div style={{ marginBottom: "0.5rem" }} className="flex items-center justify-between">
              <h5 className="font-semibold text-base-content">
                🧾 Test Case #{i + 1}
              </h5>
              <span
                className={`badge px-3 py-2 text-xs text-white ${
                  test.passed ? "badge-success" : "badge-error"
                }`}
              >
                {test.passed ? "✅ Passed" : "❌ Failed"}
              </span>
            </div>

            <div className="grid gap-2 text-sm">
              <p>
                <span className="font-medium text-base-content">🔹 Input:</span>{" "}
                <code className="bg-base-200 text-base-content px-2 py-1 rounded inline-block">
                  {test.input}
                </code>
              </p>
              <p>
                <span className="font-medium text-base-content">🔸 Expected:</span>{" "}
                <code className="bg-blue-100 text-primary px-2 py-1 rounded inline-block">
                  {test.expected}
                </code>
              </p>
              <p>
                <span className="font-medium text-base-content">🔻 Output:</span>{" "}
                <code
                  className={`px-2 py-1 rounded inline-block text-white ${
                    test.passed ? "bg-success/80" : "bg-error/80"
                  }`}
                >
                  {test.output}
                </code>
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <div style={{ marginTop: "0.5rem" }} className="alert alert-info shadow-sm text-sm">
      🚫 No run results yet.
    </div>
  )}
</div>


  </div>
</div>

        )}

        {/* Navigation & Submission */}
        <div className="flex justify-between items-center">
          <button
            className="btn btn-outline btn-primary"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(currentIndex - 1)}
          >
            ◀ Prev
          </button>
          {currentIndex < totalQuestions - 1 ? (
            <button
              className="btn btn-outline btn-primary"
              onClick={() => setCurrentIndex(currentIndex + 1)}
            >
              Next ▶
            </button>
          ) : (
            <button
              className="btn btn-success"
              onClick={async () => {
                await submitQuiz();
                toast.success("Quiz submitted!");
              }}
            >
              ✅ Submit Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
