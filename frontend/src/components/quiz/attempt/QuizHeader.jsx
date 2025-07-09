export default function QuizHeader({ formattedTime, currentIndex, totalQuestions }) {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-bold text-primary">⏳ Time Left: {formattedTime}</h2>
      <span className="badge badge-outline badge-primary">
        Question {currentIndex + 1} / {totalQuestions}
      </span>
    </div>
  );
}