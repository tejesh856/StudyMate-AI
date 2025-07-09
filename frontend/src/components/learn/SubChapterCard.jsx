import { CheckCircle, Copy } from "lucide-react";
import toast from "react-hot-toast";
export default function SubChapterCard({ sub, chapterNumber, index, onMarkSubChapter,isCompleted }) {
  return (
    <div key={sub._id} className="card border border-base-300 shadow-xl bg-base-100" style={{ padding: '1.5rem' }}>
      <h3 style={{ marginBottom: '0.5rem' }} className="text-2xl font-bold text-primary">{`${chapterNumber}.${index + 1} ${sub.title}`}</h3>
      <p style={{ marginBottom: '1rem' }} className="text-base-content/80 text-justify">{sub.description}</p>

      <div style={{ marginBottom: '1.5rem' }}>
        <h4 className="font-semibold text-info">✨ Key Concepts</h4>
        <ul className="list-disc list-inside text-sm text-base-content/80">
          {sub.studyMaterial?.keyConcepts?.map((concept, idx) => (
            <li key={idx}>{concept}</li>
          ))}
        </ul>
      </div>

      <div className="prose max-w-none dark:prose-invert">
        {sub.studyMaterial?.contentBlocks?.map((block, idx) => {
          if (block.type === 'text') {
            return <p key={idx} style={{ marginBottom: '1rem' }}>{block.value}</p>;
          }

          return (
            <div key={idx} className="relative bg-base-200 rounded-lg" style={{ marginBottom: '1.5rem' }}>
              <pre style={{ padding: '1rem', overflowX: 'auto' }}>
                <code>{block.value}</code>
              </pre>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(block.value);
                  toast.success('Code copied!');
                }}
                className="btn btn-xs btn-outline btn-accent absolute top-2 right-2"
              >
                <Copy className="w-3 h-3" /> Copy
              </button>
            </div>
          );
        })}
      </div>
      <div style={{marginTop:'1rem'}} className="flex justify-end">
        {isCompleted ? (
          <button className="btn btn-sm btn-outline btn-success" disabled>
            <CheckCircle className="w-4 h-4 mr-1" /> Completed
          </button>
        ) : (
          <button
            onClick={() => onMarkSubChapter(sub._id)}
            className="btn btn-sm btn-success btn-outline"
          >
            ✅ Mark as Completed
          </button>
        )}
      </div>

      {sub.includeVideo && sub.studyMaterial?.videoSuggestion && (
        <div style={{ marginTop: '2rem' }}>
          <h4 style={{ marginBottom: '0.5rem' }} className="text-lg font-semibold">🎬 Suggested Video</h4>
          <div className="aspect-video w-full rounded-xl border border-base-300 overflow-hidden">
            <iframe
              src={sub.studyMaterial.videoSuggestion.replace('watch?v=', 'embed/')}
              title="Video"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}