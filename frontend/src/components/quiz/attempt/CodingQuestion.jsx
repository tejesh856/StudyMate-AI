import Editor from "@monaco-editor/react";
import TestCaseResults from "./TestCaseResult";

export default function CodingQuestion({
  codingQ,
  quiz,
  selectedLanguage,
  setSelectedLanguage,
  runCode,
  codeAnswers,
  setCodeAnswer,
  getTemplateTrigger,
  isTemplatePending,
  templateCode,
  theme,
  codeResults
}) {
  return (
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
   <TestCaseResults results={codeResults[codingQ._id]}/>


  </div>
</div>
  );
}
