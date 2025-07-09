'use client';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { generateCourseFlow, updateCourse } from '@/services/learn';

export default function CourseEditModal({ course, onClose,onCourseFlowOpen,setCourseFlowData }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      topicTitle: course.topicTitle,
      description: course.description || '',
      numofchapters: course.numofchapters,
      includevideo: course.includevideo,
      difficulty: course.difficulty,
    },
  });
    const queryClient = useQueryClient();

  const {mutate:updateCourseTrigger,isPending} = useMutation({
    mutationFn: ({ id, data }) => updateCourse(id, data),
    onSuccess: (updatedCourse) => {
      toast.success('Course updated successfully!');
      queryClient.setQueryData(['courses'], (oldData) => {
      if (!oldData) return;

      // Assuming oldData is an array
      const uptcourse=oldData.data.map((course) =>
        course._id === updatedCourse.data._id ? updatedCourse.data : course
      );
      return {success:true,data:uptcourse};
    });
      onClose();
    },
    onError: (err) => {
      console.log('err',err)
      toast.error('Failed to update course.');
    },
  });
   const { mutate: generateCourseFlowTrigger, isPending:courseflowisPending } = useMutation({
    mutationFn: generateCourseFlow,
    onSuccess: (data) => {
      toast.success('🚀 Course generated successfully!');
      setCourseFlowData(data.data);
      onClose();
      onCourseFlowOpen();
    },
    onError: (error) => {
      toast.error('❌ Failed to generate course. Try again!');
      console.error('Error:', error);
    },
  });

  useEffect(() => {
    reset({
      topicTitle: course.topicTitle,
      description: course.description || '',
      numofchapters: course.numofchapters,
      includevideo: course.includevideo,
      difficulty: course.difficulty,
    });
  }, [course, reset]);

  const onSubmit = async (values) => {
    const { topicTitle, description, numofchapters, includevideo, difficulty } = values;

    
    const isBasicEdit =
  topicTitle !== course.topicTitle ||
  description !== course.description;
    
    const isRegenerationNeeded =
      numofchapters !== course.numofchapters ||
      includevideo !== course.includevideo ||
      difficulty !== course.difficulty;

    const payload = {
      topicTitle,
      description,
      numofchapters,
      includevideo,
      difficulty,
    };
    if (!isRegenerationNeeded && isBasicEdit) {
    updateCourseTrigger({ id: course._id, data: payload });
    return;
  }

  // CASE 2: No changes at all
  if (!isRegenerationNeeded && !isBasicEdit) {
    return;
  }

  // CASE 3: Regeneration needed
  
  if (isRegenerationNeeded) {
    generateCourseFlowTrigger({
      ...payload,
      _id: course._id,      // required for backend to identify course    // triggers regeneration
    });
  }
  };

  return (
    <div style={{padding:'1rem'}} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-base-100 rounded-xl w-full max-w-xl shadow-xl border border-base-300">
       <div
  style={{
    padding: '0rem 1.5rem',
    paddingTop: '1.5rem',
    paddingBottom: '1rem',
  }}
  className="relative border-b rounded-t-xl"
>
  {/* Close Button on Top Right */}
  <button
    onClick={onClose}
    className="absolute right-4 top-4 btn btn-sm btn-circle btn-ghost"
  >
    <X />
  </button>

  {/* Heading and Description */}
  <div className="flex items-center gap-2">
    <div className="text-primary text-2xl">
      ✏️
    </div>
    <h2 className="text-2xl font-extrabold tracking-tight text-primary">
      Edit Course
    </h2>
    <span className="badge badge-info badge-outline ml-2">Update Mode</span>
  </div>

  <p className="mt-1 text-sm text-base-content/80 leading-relaxed">
    Change <strong>topic name</strong> or <strong>description</strong> to edit course.
    <br />
    To <strong>regenerate</strong> course, change any or all of: <strong>number of chapters</strong>, <strong>difficulty</strong>, or <strong>include video</strong>.
  </p>
</div>


        <form style={{padding:'1.5rem'}} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Topic Title */}
          <label className="form-control flex gap-4">
            <div className="label">
              <span className="label-text">Topic Title</span>
            </div>
            <input
              type="text"
              {...register('topicTitle')}
              className="input input-bordered"
              placeholder="Enter course title"
            />
          </label>

          {/* Description */}
          <label className="form-control flex gap-4">
            <div className="label">
              <span className="label-text">Description</span>
            </div>
            <textarea
              {...register('description')}
              className="textarea textarea-bordered"
              placeholder="Enter short description"
            />
          </label>

          {/* Number of Chapters */}
          <label className="form-control flex gap-4">
            <div className="label">
              <span className="label-text">Number of Chapters</span>
            </div>
            <input
              type="number"
              {...register('numofchapters', { valueAsNumber: true })}
              className="input input-bordered"
              min={1}
              max={20}
            />
          </label>

          {/* Include Video Toggle */}
          <label className="form-control flex gap-4">
            <div className="label">
              <span className="label-text">Include Video</span>
            </div>
            <input
              type="checkbox"
              className="toggle checked:border-primary checked:bg-primary checked:text-white"
              {...register('includevideo')}
            />
          </label>

          {/* Difficulty */}
          <label className="form-control flex gap-4">
            <div className="label">
              <span className="label-text">Difficulty</span>
            </div>
            <select {...register('difficulty')} className="select select-bordered">
 <option value="beginner">🟢 Beginner</option>
              <option value="intermediate">🟡 Intermediate</option>
              <option value="advanced">🔴 Advanced</option>
</select>

          </label>

          {/* Buttons */}
          <div style={{paddingTop:'1rem'}} className="flex justify-end gap-2">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={courseflowisPending||isPending}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={courseflowisPending||isPending}>
              {courseflowisPending || isPending ? (
    <>
      <span className="loading loading-spinner loading-sm" />
      Saving...
    </>
  ) : (
    'Save Changes'
  )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
