import { create } from 'zustand';
import { io } from 'socket.io-client';
import { LeaveQuiz } from '@/services/quiz';

const useQuizStore = create((set, get) => ({
  socket: null,
  quizData: null,
  timer: 0,
  formattedTime: '00:00',
  currentIndex: 0,
  selectedAnswers: {},
  codeAnswers: {},
  submitted: false,
  quizStarted: false,
  timerInterval: null,
  selectedLanguage: null,
  codeResults: {},
  setSelectedLanguage: (lang) => {
  set({ selectedLanguage: lang });
},

setCodeResults: (questionId, results) => {
  set((state) => ({
    codeResults: { ...state.codeResults, [questionId]: results },
  }));
},

  setQuizData: (quizData) => {
  set({ quizData });
},


  // ✅ Replace connectSocket in Zustand store:
connectSocket: () => {
  if (get().socket) return;

  const newSocket = io(`${process.env.NEXT_PUBLIC_API_URL}`, { withCredentials: true });

  newSocket.on('connect', () => console.log('Socket connected:', newSocket.id));
  newSocket.on('disconnect', () => console.log('Socket disconnected'));

  newSocket.on('quiz_started', ({ quizId, startTime, endTime }) => {
    const remaining = Math.max(0, Math.floor((new Date(endTime) - Date.now()) / 1000));
    set({ timer: remaining });
    //get().formatAndStartTimer();
    const { submitted, timerInterval } = get();
    if (!submitted && !timerInterval) {
      get().formatAndStartTimer();
    }
  });

  newSocket.on("code_run_result", ({ questionId, results }) => {
  get().setCodeResults(questionId, results);
});


  newSocket.on('attempt_restored', (payload) => {
  const {
    selectedAnswers,
    codeAnswers,
    submittedAt,
    currentIndex,
    endTime,
  } = payload;

  const submitted = !!submittedAt;

  set({
    selectedAnswers,
    codeAnswers,
    submitted,
    currentIndex,
    timer: endTime ? Math.max(0, Math.floor((new Date(endTime) - Date.now()) / 1000)) : 0,
  });

  if (endTime && !submittedAt) {
    const { timerInterval } = get();
    if (!timerInterval) get().formatAndStartTimer();
  
  }
});



  newSocket.on('quiz_submitted', () => set({ submitted: true }));

  set({ socket: newSocket });
},



  startQuiz: ({ quizId, userId }) => {
    const { socket, quizStarted } = get();
    if (socket && !quizStarted) {
      socket.emit('start_quiz', { quizId, userId });
      set({ quizStarted: true });
    }
  },

  restoreAttempt: ({ quizId, userId }) => {
  const { socket } = get();
  if (socket) {
    socket.emit('restore_attempt', { quizId, userId });
  }
},

  runCode: ({ quizId, userId, questionId, code }) => {
  const socket = get().socket;
  const selected = get().selectedLanguage;
  if (!selected) return;
  const { language, version } = selected;
  console.log('code',code)
  if (socket) {
    socket.emit("run_code", {
      quizId,
      userId,
      questionId,
      code,
      language,
      version,
    });
  }
},

  submitQuiz: async () => {
    const { socket, timerInterval } = get();
    if (socket) {
      socket.emit('submit_quiz');
      socket.disconnect();
      set({ socket: null });
    }
    if (timerInterval) clearInterval(timerInterval);
    await LeaveQuiz();
    set({ timerInterval: null, submitted: true });
  },

  handleTimeout: async () => {
  const { socket, timerInterval } = get();

  if (timerInterval) clearInterval(timerInterval); // ✅ Clear interval
  set({ timerInterval: null });                     // ✅ Reset interval ref

  if (socket) {
    socket.emit('quiz_timeout');                    // ✅ Notify server
    socket.disconnect();
    set({ socket: null, submitted: true });         // ✅ Mark as submitted
  }

  await LeaveQuiz(); // ✅ Notify backend of quiz leave
},


  updateProgress: () => {
    const { socket, currentIndex, selectedAnswers, codeAnswers } = get();
    if (socket) {
      socket.emit('update_progress', { currentIndex, selectedAnswers, codeAnswers });
    }
  },

  setAnswer: (qid, answer) => {
    const updated = { ...get().selectedAnswers, [qid]: answer };
    set({ selectedAnswers: updated });
    get().updateProgress();
  },

  setCodeAnswer: (title, code) => {
    const updated = { ...get().codeAnswers, [title]: code };
    set({ codeAnswers: updated });
    get().updateProgress();
  },

  setCurrentIndex: (index) => {
    set({ currentIndex: index });
    get().updateProgress();
  },

  formatAndStartTimer: () => {
  if (get().timerInterval) return;

  const interval = setInterval(() => {
    const { timer, submitted } = get();

    if (timer <= 0 && !submitted) {
      clearInterval(get().timerInterval);
      set({ timerInterval: null });
      get().handleTimeout(); // ✅ auto-submit here
    } else if (!submitted) {
      const newTime = timer - 1;
      const min = Math.floor(newTime / 60).toString().padStart(2, '0');
      const sec = (newTime % 60).toString().padStart(2, '0');
      set({ timer: newTime, formattedTime: `${min}:${sec}` });
    }
  }, 1000);

  // ✅ This line MUST be outside setInterval, otherwise it's too late!
  set({ timerInterval: interval });
},



   resetQuiz: () => {
    clearInterval(get().timerInterval);
    set({
      quizData: null,
      timer: 0,
      timerInterval: null,
      formattedTime: '00:00',
      currentIndex: 0,
      selectedAnswers: {},
      codeAnswers: {},
      submitted: false,
      quizStarted: false,
    });
  },
disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      console.log('Socket manually disconnected');
    }
    set({ socket: null });
  },


}));
export default useQuizStore;  