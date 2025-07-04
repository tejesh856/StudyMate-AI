'use client';
import { useCourseSocketListeners } from '@/hooks/useCourseSocketListeners';
import React from 'react'

export default function Authlayout({ children }) {
  useCourseSocketListeners();
  return (
    <>
      {children}
    </>
  )
}
 