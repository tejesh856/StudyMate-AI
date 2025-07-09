export default function MCQQuestion({ question, currentIndex, selectedAnswers, setAnswer }) {
  return (
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
  );
}