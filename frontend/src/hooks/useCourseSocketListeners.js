import { useEffect } from 'react';
import { socket } from '@/lib/socket';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const useCourseSocketListeners = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    socket.on('course:ready', ({ courseId, message }) => {
      // ✅ Update course status to ready
      queryClient.setQueryData(['courses'], (old) =>
        old.data?.map((c) =>
          c._id === courseId ? { ...c, status: 'ready' } : c
        )
      );

      // ✅ Push real-time notification to notification list
      /*queryClient.setQueryData(['notifications'], (old = []) => [
        {
          _id: Date.now().toString(),
          title: 'Course Ready',
          message,
          createdAt: new Date(),
          read: false,
          type: 'course_ready',
        },
        ...old,
      ]);*/

      toast.success('🎉 A new course is ready!');
    });

    return () => {
      socket.off('course:ready');
    };
  }, [queryClient]);
};
