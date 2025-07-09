import { generateCourseFlow } from '@/services/learn';
import { useMutation } from '@tanstack/react-query';
import { Sparkles, X } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function CourseGenerateModal({ onClose, onOpen, setCourseFlowData }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      topic: '',
      description: '',
      difficulty: 'intermediate',
      numofchapters: '',
      includevideo: false,
    },
  });

  const { mutate: generateCourseFlowTrigger, isPending } = useMutation({
    mutationFn: generateCourseFlow,
    onSuccess: (data) => {
      toast.success('🚀 Course generated successfully!');
      setCourseFlowData(data.data);
      reset();
      onClose();
      onOpen();
    },
    onError: (error) => {
      toast.error('❌ Failed to generate course. Try again!');
      console.error('Error:', error);
    },
  });

  const onSubmit = ({ topic, description, difficulty, numofchapters, includevideo }) => {
    if (!topic.trim()) {
      toast.error('Topic is required!');
      return;
    }

    const payload = {
      topicTitle: topic.trim(),
      description: description.trim(),
      difficulty,
      numofchapters: numofchapters ? parseInt(numofchapters, 10) : 10,
      includevideo: !!includevideo,
    };

    generateCourseFlowTrigger({...payload});
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div style={{ padding: '1rem' }} className="modal-box w-full opacity-100 max-w-lg bg-base-100 shadow-xl rounded-xl relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle absolute right-4 top-4 hover:bg-error hover:text-white"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }} className="text-center">
          <h3 className="text-3xl font-bold text-primary flex justify-center items-center gap-2">
            <Sparkles size={28} /> Generate Course
          </h3>
          <p style={{ marginTop: '0.5rem' }} className="text-sm text-base-content">Fill in the details to auto-generate a course structure</p>
        </div>

        {/* Form */}
        <form style={{ padding: '0rem 0.5rem' }} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* Topic */}
          <div className="form-control flex flex-col gap-4">
            <label className="label font-semibold">📘 Course Name</label>
            <input
            style={{padding: '0.5rem 0.5rem'}}
              {...register('topic', { required: true })}
              type="text"
              placeholder="e.g., React Hooks"
              className="input input-bordered w-full"
            />
            {errors.topic && <span style={{marginTop: '0.25rem'}} className="text-error text-sm">Topic is required</span>}
          </div>

          {/* Description */}
          <div className="form-control flex flex-col gap-4">
            <label className="label font-semibold">📝 Description (optional)</label>
            <textarea
            style={{padding: '0.5rem 0.5rem'}}
              {...register('description', { required: false })}
              className="textarea textarea-bordered w-full"
              placeholder="Brief overview of the course"
              rows={3}
            />
          </div>

          {/* Difficulty */}
          <div className="form-control flex flex-col gap-4">
            <label className="label font-semibold">📈 Difficulty Level</label>
            <select style={{padding: '0rem 0.5rem'}} {...register('difficulty')} className="select select-bordered w-full">
              <option value="beginner">🟢 Beginner</option>
              <option value="intermediate">🟡 Intermediate</option>
              <option value="advanced">🔴 Advanced</option>
            </select>
          </div>

          {/* Number of Chapters */}
          <div className="form-control flex flex-col gap-4">
            <label className="label font-semibold">📚 Number of Chapters</label>
            <input
            style={{padding: '0rem 0.5rem'}}
              {...register('numofchapters',{
      valueAsNumber: true,
      required: 'Number of chapters is required',
      min: {
        value: 3,
        message: 'Minimum of 3 chapters required',
      },
      max: {
        value: 10,
        message: 'Maximum of 10 chapters allowed',
      },
    })}
              type="number"
              className="input input-bordered w-full"
              placeholder="e.g., 5"
            />
            {errors.numofchapters && (
  <span style={{ marginTop: '0.25rem' }} className="text-error text-sm">
    {errors.numofchapters.message}
  </span>
)}

          </div>

          {/* Include Video */}
          <div style={{ marginTop: '0.25rem' }} className="form-control flex flex-row items-center justify-between gap-4">
            <label className="label font-semibold">🎥 Include Video Lessons</label>
            <input
              type="checkbox"
              {...register('includevideo')}
              className="toggle checked:border-primary checked:bg-primary checked:text-white"
            />
          </div>

          {/* Buttons */}
          <div style={{ marginTop: '1.5rem' }} className="flex justify-end gap-3">
            <button
              style={{ padding: '0.5rem 0.5rem' }}
              type="submit"
              className={`btn btn-primary ${isPending ? 'loading' : ''}`}
              disabled={isPending}
            >
              {isPending ? 'Generating...' : '🚀 Generate Couse Flow'}
            </button>
            <button style={{ padding: '0.5rem 0.5rem' }} type="button" onClick={onClose} className="btn btn-outline btn-error">
              ❌ Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
