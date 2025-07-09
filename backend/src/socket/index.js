import { runCodeWithPiston } from '../services/codeExecution.js';
import { formatMMSS, isJsonEqual } from '../lib/utils.js';
import Quiz from '../models/quiz.model.js';
import QuizAttempt from '../models/quizAttempt.model.js';

const activeAttempts = new Map(); // memory cache per socket/user

export const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);
    socket.on('join_user_room', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });
    // On server (Node.js + socket.io)s

    // When quiz starts
    socket.on('start_quiz', async ({ quizId, userId }) => {
  if (activeAttempts.has(socket.id)) return;

  const quiz = await Quiz.findById(quizId);
  if (!quiz) return socket.emit('error', { message: 'Quiz not found' });

  const startTime = new Date();
  const endTime = new Date(startTime.getTime() + (quiz.duration || 10) * 60 * 1000);

  activeAttempts.set(socket.id, {
    quizId,
    userId,
    currentIndex: 0,
    selectedAnswers: {},
    codeAnswers: {},
    startTime,
    endTime,
  });

  socket.join(quizId.toString());

  socket.emit('quiz_started', {
    quizId,
    startTime,
    endTime,
    duration: quiz.duration * 60,
    formattedDuration: formatMMSS(quiz.duration * 60),
  });
});



    // Periodic updates from frontend
    socket.on('update_progress', ({ currentIndex, selectedAnswers, codeAnswers }) => {
  const attempt = activeAttempts.get(socket.id);
  if (attempt) {
    attempt.currentIndex = currentIndex;
    attempt.selectedAnswers = selectedAnswers;
    attempt.codeAnswers = codeAnswers;
  }
});


    // Save progress (used for autosave or disconnection)
   const saveQuizProgress = async (socketId, isFinalSubmission = false) => {
  const attempt = activeAttempts.get(socketId);
  if (!attempt) return;

  const { quizId, userId, selectedAnswers, codeAnswers, startTime, endTime, currentIndex } = attempt;

  const quiz = await Quiz.findById(quizId);
  if (!quiz) return;

  let score = 0;
  quiz.mcqs.forEach((q) => {
    if (selectedAnswers[q._id] === q.answer) score++;
  });
  let codingScore = 0;
quiz.coding?.forEach((q) => {
  const results = attempt.codeResults?.[q._id];
  if (results && Array.isArray(results)) {
    const passed = results.filter(r => r.passed).length;
    const total = results.length;
    codingScore += (passed / total); // you can scale this as needed
  }
});

const totalscore = score + codingScore;

  const updateData = {
    quizId,
    userId,
    mcqAnswers: selectedAnswers,
    codeAnswers,
    totalscore,
    mcqscore: score,
    codingscore: codingScore,
    startTime,
    currentIndex,
  };

  if (isFinalSubmission) {
    updateData.submittedAt = new Date();
    activeAttempts.delete(socketId); // only delete on final submit
  }

  await QuizAttempt.findOneAndUpdate(
    { quizId, userId },
    updateData,
    { upsert: true, new: true }
  );
};




    // Manual submission from frontend
    socket.on('submit_quiz', async () => {
  await saveQuizProgress(socket.id,true);
  socket.emit('quiz_submitted', { autoSubmitted: false });
  socket.emit('clear_quiz_cookie');
  socket.leaveAll();
});


    // Auto-submit on timer expiration
    socket.on('quiz_timeout', async () => {
  await saveQuizProgress(socket.id,true);
  socket.emit('quiz_submitted', { autoSubmitted: true });
  socket.emit('clear_quiz_cookie');
  socket.leaveAll();
});


    // Restore progress on reload/reconnect
    // socket.on('restore_attempt', ...)
socket.on('restore_attempt', async ({ quizId, userId }) => {
  const attempt = activeAttempts.get(socket.id);

  if (attempt) {
    socket.emit('attempt_restored', {
      ...attempt,
      endTime: attempt.endTime,
    });
  } else {
    const pastAttempt = await QuizAttempt.findOne({ quizId, userId });
    if (pastAttempt) {
      const quiz = await Quiz.findById(quizId);
      const duration = quiz?.duration || 10;
      const endTime = new Date(pastAttempt.startTime.getTime() + duration * 60000);

      socket.emit('attempt_restored', {
        selectedAnswers: pastAttempt.mcqAnswers || {},
        codeAnswers: pastAttempt.codeAnswers || {},
        score: pastAttempt.score || 0,
        submittedAt: pastAttempt.submittedAt,
        startTime: pastAttempt.startTime,
        endTime: pastAttempt.submittedAt ? null : endTime,
        currentIndex: pastAttempt.currentIndex || 0, // ✅ critical!
      });
    }
  }
});

socket.on('run_code', async ({ quizId, userId, questionId, code, language,version }) => {
  const quiz = await Quiz.findById(quizId);
  const question = quiz?.coding?.find(q => q._id.toString() === questionId);
  if (!question) return socket.emit('code_run_result', { error: 'Question not found' });

  const testCases = question.testCases || [];

  const results = [];
  for (const test of testCases) {
    const { input, output: expected } = test;
const stdin = Array.isArray(test.input) ? test.input.join(' ') : test.input;
const { output: actual, success } = await runCodeWithPiston({ language, code, input: stdin, version });
    
    results.push({
      input,
      expected,
      output: actual,
      passed: success && isJsonEqual(actual, expected),
    });
  }

  // Save in active memory
  const attempt = activeAttempts.get(socket.id);
  if (attempt) {
    if (!attempt.codeAnswers) attempt.codeAnswers = {};
    if (!attempt.codeResults) attempt.codeResults = {};
    attempt.codeAnswers[questionId] = code;
    attempt.codeResults[questionId] = results;
  }

  // Optionally save in DB
  await QuizAttempt.findOneAndUpdate(
    { quizId, userId },
    {
      $set: {
        [`codeAnswers.${questionId}`]: code,
        [`codeResults.${questionId}`]: results,
      }
    },
    { upsert: true, new: true }
  );

  socket.emit('code_run_result', {
    questionId,
    results,
  });
});




    // Handle disconnection (autosave)
    socket.on('disconnect', async () => {
  console.log('Socket disconnected:', socket.id);
  await saveQuizProgress(socket.id,false);
});

  });
};