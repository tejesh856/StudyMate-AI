import Progress from "../models/Progress.model.js";
import Suggestion from "../models/Suggestion.model.js";
import dayjs from 'dayjs';
import Course from "../models/Course.model.js";
import quizAttempt from "../models/quizAttempt.model.js";
import { generateDailySuggestions } from "../langchain/generalSuggestion.js";
import { calculateLearningStreak } from "../lib/utils.js";
export const getStats=async (req,res,next)=>{
    const userId = req.user._id;
    try {
        const today = dayjs().startOf("day").toDate();
    const existing = await Suggestion.findOne({
      userId,
      date: { $gte: today },
    });

    if (existing) {
      return res.status(200).json({
        suggestions: existing.suggestions,
        stats: existing.stats,
      });
    }
    const courses = await Course.find({ studentId: userId }).lean();
    const quizAttempts = await quizAttempt.find({ userId }).populate("quizId").lean();

    // Calculate stats
    const totalQuizzesTaken = quizAttempts.length;
    const coursesCompleted = courses.filter(c => c.status === "ready").length;
    const progressLogs = await Progress.find({ studentId: userId }).lean();
const learningDates = [
  ...quizAttempts.map(a => a.startTime),
  ...progressLogs.map(p => p.lastVisitedAt),
].filter(Boolean);
    const learningStreak = calculateLearningStreak(learningDates);

    // Count previous suggestions
    const aiSuggestionCount = await Suggestion.countDocuments({ userId });

    // Generate new suggestions
    const pastQuizzes = quizAttempts
  .filter(a => a.quizId && a.quizId.topic)
  .map(a => ({
    id: a.quizId._id.toString(),
    topic: a.quizId.topic,
    difficulty: a.quizId.difficulty || 'medium',
  }));

    const suggestions = await generateDailySuggestions({
      courses,
      quizAttempts,
      pastQuizzes: pastQuizzes,
    });

    const stats = {
      totalQuizzesTaken,
      coursesCompleted,
      learningStreak,
      aiSuggestionCount: aiSuggestionCount + 1,
    };

    // Save to DB
    await Suggestion.create({
      userId,
      suggestions,
      stats,
      date: new Date(),
    });

    res.status(201).json({ suggestions, stats, alreadyGenerated: false });
    } catch (error) {
        console.log('error',error)
        next(error)
    }
}
export const getResumeProgress=async (req,res,next)=>{
    const studentId = req.user._id;
    try {
        const progressList = await Progress.find({ studentId })
      .sort({ lastVisitedAt: -1 })
      .limit(4)
      .populate('courseId')
      .lean();

    const resumeData = progressList
      .filter(p => p.courseId) // Exclude any broken relations
      .map(progress => {
        const course = progress.courseId;
        const completedSubChapters = progress.completedSubChapters || [];

        const totalSubChapters = course.chapters?.reduce(
          (acc, ch) => acc + (ch.subChapters?.length || 0), 0
        ) || 0;

        const completedCount = completedSubChapters.length;
        const percentage = totalSubChapters > 0
          ? Math.round((completedCount / totalSubChapters) * 100)
          : 0;

        return {
          courseId: course._id,
          topicTitle: course.topicTitle,
          image: course.image,
          difficulty: course.difficulty,
          numofchapters: course.numofchapters,
          status: course.status,
          createdAt: course.createdAt,
          subject:course.subject,
          progress: {
            completedSubChapters,
            percentage,
            lastChapterIdx: progress.lastChapterIdx ?? 0,
            lastSubChapterId: progress.lastSubChapterId ?? null,
            lastVisitedAt: progress.lastVisitedAt,
          },
        };
      });

    return res.status(200).json({ success: true, data: resumeData });
    } catch (error) {
        next(error)
    }
}