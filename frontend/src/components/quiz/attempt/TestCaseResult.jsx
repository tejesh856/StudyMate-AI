export default function TestCaseResults({ results }) {
  return (
  <div style={{ marginTop: "1.5rem" }}>
  <h4 style={{ marginBottom: "1rem" }} className="text-lg font-bold text-primary">
    🧪 Test Case Results
  </h4>

  {results?.length ? (
    <ul className="flex flex-col gap-4">
      {results.map((test, i) => (
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
  );
}