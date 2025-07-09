import { useEffect } from 'react';
import { socket } from '@/lib/socket';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const useCourseSocketListeners = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    socket.on('course:ready', ({ course, notification,message }) => {
      // ✅ Update course status to ready
      queryClient.setQueryData(['courses'], (old) => {
  if (!old?.data) return old;

  return {
    ...old,
    data: old.data.map((c) =>
      c._id === course._id ? course : c
    ),
  };
});


      queryClient.setQueryData(['notifications'], (old) => {
        if (!old?.data) return { data: [notification] };
        return {
          ...old,
          data: [notification, ...old.data],
        };
      });
      toast.success(`🎉 ${message}`);
    });

    return () => {
      socket.off('course:ready');
    };
  }, [queryClient]);
};
