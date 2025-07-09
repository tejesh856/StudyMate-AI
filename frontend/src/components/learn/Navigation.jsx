'use client';
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
export default function Navigation({ currentChapterIdx, handlePrev, handleNext, currentChapter, chapters }) {
  return (
    <div style={{ marginBottom: '2rem' }} className="flex justify-between items-center gap-4">
      <button style={{ padding: '0rem 0.25rem' }} onClick={handlePrev} disabled={currentChapterIdx === 0} className="btn btn-outline btn-secondary">
        <ChevronLeft className="w-4 h-4" /> Prev
      </button>
      <div className="text-lg font-semibold text-center">
        📖 Chapter {currentChapterIdx + 1}: {currentChapter.title}
      </div>
      <button style={{ padding: '0rem 0.25rem' }} onClick={handleNext} disabled={currentChapterIdx === chapters.length - 1} className="btn btn-outline btn-secondary">
        Next <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}