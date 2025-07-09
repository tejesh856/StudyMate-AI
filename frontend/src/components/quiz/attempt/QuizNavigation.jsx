import toast from "react-hot-toast";

export default function QuizNavigation({ currentIndex, totalQuestions, setCurrentIndex, submitQuiz, submitted, queryClient }) {
  return (
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
            queryClient.invalidateQueries({ queryKey: ['stats'] });
          }}
        >
          ✅ Submit Quiz
        </button>
      )}
    </div>
  );
}