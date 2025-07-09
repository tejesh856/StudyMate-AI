// 📁 stores/useCourseStore.js
import { create } from 'zustand';

const useCourseStore = create((set) => ({
  isCourseGenerateModalOpen: false,
  isCourseFlowModalOpen: false,
  selectedCourseForEdit: null,
  courseFlowData: null,
  suggestionPayload: null,
  isgenerateCourseFlowPending:false,


  setIsCourseGenerateModalOpen: (value) => set({ isCourseGenerateModalOpen: value }),
  setIsCourseFlowModalOpen: (value) => set({ isCourseFlowModalOpen: value }),
  setSelectedCourseForEdit: (course) => set({ selectedCourseForEdit: course }),
  setCourseFlowData: (data) => set({ courseFlowData: data }),
  setSuggestionPayload: (payload) => set({ suggestionPayload: payload }),
  setisgenerateCourseFlowPending: () => set({ isgenerateCourseFlowPending: true }),
  clearSuggestionPayload: () => set({ suggestionPayload: null }),

}));

export default useCourseStore;
