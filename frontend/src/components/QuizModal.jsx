'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Sparkles, X } from 'lucide-react';

export default function QuizModal({ onClose }) {
  const { register, handleSubmit, reset } = useForm();
  const router = useRouter();

  const onSubmit = ({ topic, difficulty, numQuestions }) => {
    if (!topic.trim()) {
      toast.error('Topic is required!');
      return;
    }
    router.push(`/quiz/attempt?topic=${topic}&difficulty=${difficulty}&numQuestions=${numQuestions}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 bg-opacity-40 backdrop-blur-sm flex items-center justify-center">
      <div style={{padding:'1rem'}} className="modal-box opacity-100 w-full max-w-md relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle absolute right-3 top-3 hover:bg-red-500 hover:text-white"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <h3 style={{marginBottom:'1rem'}} className="font-bold text-2xl flex items-center gap-2 text-primary">
          <Sparkles size={28} /> Generate New Quiz
        </h3>

        {/* Form */}
        <form style={{padding:'0 0.5rem'}} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Topic Input */}
          <div className="form-control">
            <label style={{marginBottom:'0.5rem'}} className="label">
              <span className="label font-semibold">📘 Topic</span>
            </label>
            <input
              {...register('topic')}
              style={{padding:'0 0.5rem'}}
              placeholder="Enter topic (e.g. DBMS)"
              className="input input-bordered w-full"
            />
          </div>

          {/* Difficulty Select */}
          <div className="form-control">
            <label style={{marginBottom:'0.5rem'}} className="label">
              <span className="label-text font-semibold">📈 Difficulty</span>
            </label>
            <select style={{padding:'0 0.5rem'}} {...register('difficulty')} defaultValue="medium" className="select select-bordered w-full">
              <option value="easy">🟢 Easy</option>
              <option value="medium">🟡 Medium</option>
              <option value="hard">🔴 Hard</option>
            </select>
          </div>

          {/* Number of Questions */}
          <div className="form-control">
            <label style={{marginBottom:'0.5rem'}} className="label ">
              <span className="label-text font-semibold">🔢 Number of Questions</span>
            </label>
            <input
              {...register('numQuestions')}
              type="number"
              min={1}
              max={50}
              style={{padding:'0 0.5rem'}}
              placeholder="Number of Questions"
              className="input input-bordered w-full"
            />
          </div>

          {/* Buttons */}
          <div style={{marginTop:'1.5rem'}} className="flex justify-end gap-3">
            <button style={{padding:'0 0.5rem'}} type="submit" className="btn btn-success">
              🚀 Generate
            </button>
            <button style={{padding:'0 0.5rem'}} type="button" onClick={onClose} className="btn btn-error">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
