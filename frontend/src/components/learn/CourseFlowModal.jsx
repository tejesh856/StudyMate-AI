import React, { useEffect } from 'react';
import { X, Video } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { generateCourse, generateCourseFlow } from '@/services/learn';
import useCourseStore from '@/store/useCourseStore';

export default function CourseFlowModal({ courseFlowData, onClose }) {
  const queryClient = useQueryClient();
  const {setCourseFlowData,suggestionPayload,clearSuggestionPayload}=useCourseStore();

   const { mutate: generateCourseFlowTrigger, isPending:isgenerateCourseFlowPending } = useMutation({
    mutationFn: generateCourseFlow,
    onSuccess: (data) => {
      toast.success('🚀 Course generated successfully!');
      setCourseFlowData(data.data);
      clearSuggestionPayload();
    },
    onError: (error) => {
      toast.error('❌ Failed to generate course. Try again!');
      console.error('Error:', error);
      clearSuggestionPayload();
    },
  });



  const { mutate: generateStudyMaterialsTrigger, isPending } = useMutation({
    mutationFn: generateCourse,
    onSuccess: (data) => {
      const generatedCourse = data.data;
      queryClient.setQueryData(['courses'], (oldData) => {
        if (!oldData.data) return [generatedCourse];

        const exists = oldData.data.find((c) => c._id === generatedCourse._id);
      if (exists) {
        const updatedData = oldData.data.map((c) =>
      c._id === generatedCourse._id ? { ...c, status: 'pending' } : c
    );
    return { ...oldData, data: updatedData };
      }

      return {
    ...oldData,
    data: [...oldData.data, { ...generatedCourse, status: 'pending' }],
  };
      });

      toast.success('🚀 Course generation started');
      onClose();
    },
    onError: (error) => {
      toast.error('❌ Failed to generate study materials. Try again!');
      console.error('Error:', error);
    },
  });

  useEffect(() => {
    if (suggestionPayload) {
      generateCourseFlowTrigger({
        topicTitle: suggestionPayload.topic,
        description: suggestionPayload.description,
        difficulty: suggestionPayload.difficulty,
        numofchapters: suggestionPayload.numofchapters,
        includevideo: suggestionPayload.includevideo,
      });
    }
  }, [suggestionPayload]);

  const handleGenerateStudyMaterial = () => {

  // ✅ Validate input
  if (
    !courseFlowData ||
    !courseFlowData.topicTitle ||
    !courseFlowData.chapters ||
    !courseFlowData.difficulty ||
    courseFlowData.includevideo === undefined ||
    !courseFlowData.numofchapters
  ) {
    toast.error('❌ Invalid course flow data. Please try again.');
    return;
  }

  const isRegenerate = !!courseFlowData._id; // true if updating an existing course

  const coursePayload = {
    topicTitle: courseFlowData.topicTitle,
    description: courseFlowData.description,
    difficulty: courseFlowData.difficulty,
    includevideo: courseFlowData.includevideo,
    numofchapters: courseFlowData.numofchapters,
    chapters: courseFlowData.chapters,
  };

  // ✅ Only add _id if it's a regenerate flow
  if (isRegenerate) {
    coursePayload._id = courseFlowData._id;
  }

  // 🔁 Call API with optional regenerate flag
  generateStudyMaterialsTrigger({
    course: coursePayload,
  });
};


  const handleCancelCourseFlow = () => {
    onClose();
  };

  if (isgenerateCourseFlowPending) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center">
      <div style={{padding:'2rem'}} className="bg-base-100 border border-primary/40 shadow-2xl rounded-3xl w-[90%] max-w-lg flex flex-col items-center gap-6 animate-fade-in">
        {/* Animated Icon with Glow Ring */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="loading loading-ring loading-lg text-primary"></span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Video className="w-10 h-10 text-primary animate-bounce" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-xl font-bold text-primary text-center">
          Crafting Your Learning Journey...
        </h2>

        {/* Subtext */}
        <p className="text-sm text-base-content/70 text-center max-w-xs">
          ✨ Hold tight! We’re designing your course flow with chapters, subchapters, and videos tailored just for you.
        </p>

        {/* Progress Bar */}
        <progress className="progress progress-primary w-full" />
      </div>
    </div>
  );
}



  if (!courseFlowData) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center p-4">
      <div style={{padding: '1rem'}} className="modal-box w-full opacity-100 max-w-5xl bg-base-100 border border-primary/40 shadow-2xl rounded-3xl relative max-h-[90vh] overflow-hidden flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle absolute right-5 top-5 hover:bg-error hover:text-white transition"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{padding: '0rem 1.5rem',paddingTop: '2.5rem'}} className="border-b border-base-300">
          <h2 className="text-4xl font-extrabold text-primary flex items-center gap-3">
            📘 {courseFlowData.topicTitle}
          </h2>
          <p style={{marginTop: '0.5rem'}} className="text-sm text-base-content/70">
            Here's your personalized course flow breakdown.
          </p>
        </div>

        {/* Chapters */}
        <div style={{padding: '1rem 1.5rem'}} className=" overflow-y-auto flex-grow space-y-6">
          {courseFlowData?.chapters?.map((chapter, idx) => (
            <div
            style={{marginBottom: '1rem'}}
              key={idx}
              className="collapse collapse-arrow border border-base-300 bg-base-200 rounded-xl group"
            >
              <input type="checkbox" className="peer" />
              <div className="collapse-title text-lg font-semibold flex justify-between items-center text-base-content peer-hover:text-primary transition">
                <div style={{padding: '0.75rem 0.75rem'}} className="flex items-center gap-3">
                  <span style={{padding: '0.25rem'}} className="badge badge-primary badge-outline text-xs">{`Chapter ${idx + 1}`}</span>
                  {chapter.title}
                </div>
                
              </div>
              <div className="collapse-content space-y-4 text-base-content">
                <p style={{padding:'0rem 0.75rem',paddingBottom:'1rem'}} className="italic text-sm text-base-content/80">{chapter.description}</p>

                {/* Subchapters */}
                <div style={{paddingLeft:'1rem'}} className="border-l-2 border-primary space-y-3">
                  {chapter.subChapters?.map((sub, subIdx) => (
                    <div
                    style={{padding: '1rem',marginBottom: '0.5rem'}}
                      key={subIdx}
                      className="bg-base-100 border border-base-300 rounded-xl hover:shadow-lg transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-base-content flex items-center gap-2">
                          <span className="text-sm text-primary/80">{`${idx + 1}.${subIdx + 1}`}</span>
                          {sub.title}
                        </div>
                        {sub.includeVideo && (
                          <span className="badge badge-sm badge-secondary gap-1 flex items-center">
                            <Video size={14} />
                            Video
                          </span>
                        )}
                      </div>
                      <p style={{marginTop: '0.25rem'}} className="text-sm text-base-content/70">{sub.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{padding: '1rem 1.5rem'}} className=" border-t border-base-300 flex justify-end gap-4">
          <button disabled={isPending} className={`btn btn-primary hover:scale-105 transition-all shadow-md ${isPending?'loading':''}`}
               onClick={handleGenerateStudyMaterial}>
            📚 Generate Study Material
          </button>
          <button
            onClick={handleCancelCourseFlow}
            className="btn btn-outline btn-error hover:scale-105 transition-all shadow-md"
          >
            ❌ Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
