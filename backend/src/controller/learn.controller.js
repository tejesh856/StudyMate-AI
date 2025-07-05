import createError from "http-errors";
import { enrichCourseQueue } from "../jobs/enrichCourseQueue.js";
import { analyzeCourseTopic } from "../langchain/learn/analyzeCourseTopic.js";
import { generateCourseFlow } from "../langchain/learn/CourseFlowGenerate.js";
import { extractCourseKeyword } from "../langchain/learn/extractCourseKeyword.js";
import { findSimilarCourseTopic } from "../langchain/learn/findSimilarCourseTopic.js";
import Course from "../models/Course.model.js";
import Progress from "../models/Progress.model.js";
import { generateImageFromTopic } from "../services/imageGeneration.js";
export const CourseFlowGenerate = async (req, res, next) => {
  const { topicTitle, description, difficulty, numofchapters, includevideo, _id = null } = req.body;
  const studentId = req.user._id;

  if (!topicTitle || !difficulty || !numofchapters || includevideo === undefined) {
    throw createError(400, "Missing required fields")
    //return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    let previousCourse = null;
    let topicChanged = false;
    let shouldRegenerate = true;

    if (_id) {
      // Fetch existing course if ID provided
      previousCourse = await Course.findById(_id).lean();
      if (!previousCourse) {
        throw createError(404, "Course not found")
        //return res.status(404).json({ success: false, message: "Course not found" });
      }

      topicChanged = previousCourse.topicTitle.trim().toLowerCase() !== topicTitle.trim().toLowerCase();

      const difficultyChanged = previousCourse.difficulty !== difficulty;
      const videoChanged = previousCourse.includevideo !== includevideo;
      const chapterCountChanged = previousCourse.numofchapters !== numofchapters;

      // If no relevant fields changed, skip regeneration
      shouldRegenerate = topicChanged || difficultyChanged || videoChanged || chapterCountChanged;
      if (!shouldRegenerate) {
        return res.status(200).json({
          success: true,
          data: {
            ...previousCourse,
            reused: true
          }
        });
      }
    }

    // Only analyze and check for existing if topic title changed
    let subject;
    let domain;
    if (!_id || topicChanged) {
      const analysis = await analyzeCourseTopic(topicTitle);
      if (!analysis.valid) {
        throw createError(400, `Invalid topic: ${analysis.reason || "The topic is too vague or unclear for a course."}`)
        /*return res.status(400).json({
          success: false,
          message: `Invalid topic: ${analysis.reason || "The topic is too vague or unclear for a course."}`,
        });*/
        
      }

      const existing = await findSimilarCourseTopic(topicTitle, studentId);
      if (existing) {
        /*return res.status(409).json({
          success: false,
          message: `This topic is already covered or closely related to "${existing.topic}".`,
          reason: existing.reason,
        });*/
        throw createError(400, `This topic is already covered or closely related to "${existing.topic}`)

      }
      subject=analysis.subject;
      domain=analysis.languageOrDomain;
    }

    // Generate new course flow
    const flow = await generateCourseFlow({
      topicTitle,
      description,
      difficulty,
      numofchapters,
      includevideo,
      subject,
      domain
    });

    return res.status(200).json({
      success: true,
      data: {
        ...flow,
        description,
        difficulty,
        numofchapters,
        includevideo,
        _id
      },
    });

  } catch (error) {
    console.error("❌ Error generating topic flow:", error);
    next(error);
  }
};


export const generateCourseMaterial = async (req, res, next) => {
  const { course } = req.body;
  const studentId = req.user._id;

  if (!course || !course.chapters?.length) {
    throw createError(400, `Invalid course data`)
    //return res.status(400).json({ success: false, message: "Invalid course data" });
  }

  const {
    _id: courseId,
    topicTitle,
    description,
    difficulty,
    numofchapters,
    includevideo,
    chapters,
  } = course;
  try {
    // 🔁 If courseId exists → regenerate course
    if (courseId) {
      const existingCourse = await Course.findById(courseId);
      if (!existingCourse) {
        throw createError(404, `Course not found for regeneration`)
        //return res.status(404).json({ success: false, message: "Course not found for regeneration" });
      }

      //const enrichedChapters = await enrichChapters(chapters, difficulty,existingCourse.subject,existingCourse.languageOrDomain);
      startEnrichCourseWorker();
      await enrichCourseQueue.add('enrichCourse', {
        courseId,
        chapters,
        difficulty: existingCourse.difficulty,
        subject: existingCourse.subject,
        domain: existingCourse.languageOrDomain,
        includeVideo: existingCourse.includevideo,
      });
      // Update fields
      existingCourse.topicTitle = topicTitle;
      existingCourse.description = description;
      existingCourse.difficulty = difficulty;
      existingCourse.includevideo = includevideo;
      existingCourse.numofchapters = numofchapters;

      await existingCourse.save();

      return res.status(200).json({ success: true, data: existingCourse });
    }

    // 🆕 New Course Flow
    // Step 1: Validate topic
    const analysis = await analyzeCourseTopic(topicTitle);
    if (!analysis.valid) {
      throw createError(400, `Invalid topic: ${analysis.reason || "The topic is too vague or unclear for a course."}`)
      /*return res.status(400).json({
        success: false,
        message: `Invalid topic: ${analysis.reason || "Topic is too vague for a course."}`,
      });*/
    }

    // Step 2: Check for similar topics
    const similar = await findSimilarCourseTopic(topicTitle, studentId);
    if (similar) {
      throw createError(400, `This topic is already covered or closely related to "${similar.topic}`)
      /*return res.status(409).json({
        success: false,
        message: `This topic is already covered or closely related to "${similar.topic}".`,
        reason: similar.reason,
      });*/
    }

    // Step 3: Generate study material
    //const enrichedChapters = await enrichChapters(chapters, difficulty,analysis.subject,analysis.languageOrDomain);
    
    // Step 4: Generate image for course
    const keywordPrompt = analysis.languageOrDomain?.trim() || (await extractCourseKeyword(topicTitle));
    const imagePrompt = `A modern, vibrant course banner with the title '${keywordPrompt.toUpperCase()}' in large, bold, centered text. The background design should visually represent the course subject — use circuit boards or code screens for coding, mathematical symbols and equations for math, atoms and lab glassware for chemistry, planets or formulas for physics, and books or gavels for law. The layout should be clean and engaging, suitable for an educational platform homepage or course detail page. Make it visually appealing and clearly related to the course content.`;

    const courseImage = await generateImageFromTopic(keywordPrompt,imagePrompt, false);

    const newCourse = await Course.create({
      studentId,
      topicTitle,
      description,
      difficulty,
      includevideo,
      numofchapters,
      subject: analysis.subject,
      languageOrDomain: analysis.languageOrDomain,
      image: courseImage,
      //chapters: enrichedChapters,
      createdAt: new Date(),
    });
    startEnrichCourseWorker();
    await enrichCourseQueue.add("enrichCourse", {
      courseId: newCourse._id.toString(),
      chapters,
      difficulty,
      subject: analysis.subject,
      domain: analysis.languageOrDomain,
      includeVideo: includevideo,
    });

    return res.status(201).json({ success: true, data: newCourse });

  } catch (err) {
    console.error("❌ Error generating/regenerating course material:", err);
    next(err);
  }
};
export const getCourses = async (req, res, next) => {
  const studentId = req.user._id;

  try {
    const courses = await Course.find({
      studentId,
    }).lean();

    // Fetch progress for all courses at once to avoid multiple DB calls
    const courseIds = courses.map(course => course._id);
    const progressDocs = await Progress.find({
      studentId,
      courseId: { $in: courseIds },
    }).lean();

    // Map courseId to its progress
    const progressMap = {};
    for (const doc of progressDocs) {
      progressMap[doc.courseId.toString()] = doc;
    }

    const enrichedCourses = courses.map(course => {
      const courseId = course._id.toString();
      const progress = progressMap[courseId];
      const completedSubChapters = progress?.completedSubChapters || [];

      const totalSubChapters = course.chapters?.reduce((acc, ch) => acc + (ch.subChapters?.length || 0), 0) || 0;
      const completedCount = completedSubChapters.length;
      const percentage = totalSubChapters > 0 ? Math.round((completedCount / totalSubChapters) * 100) : 0;

      return {
        ...course,
        status: course.status,
        progress: {
          completedSubChapters,
          percentage,
        },
      };
    });

    return res.status(200).json({
      success: true,
      data: enrichedCourses,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    next(err)
  }
};

export const getCourse = async (req, res) => {
  const { id } = req.params;
  const studentId=req.user._id;

  if (!id) {
    throw createError(400, `Missing course ID`)
    //return res.status(400).json({ success: false, message: "Missing course ID" });
  }

  try {
    const course = await Course.findById(id).lean();

    if (!course) {
      //return res.status(404).json({ success: false, message: "Course not found" });
      throw createError(400, `Course not found`)
    }

    const progress = await Progress.findOne({
        courseId: course._id,
        studentId,
      }).lean();    
    

    const courseWithProgress = {
      ...course,
      progress: {
        completedSubChapters: progress?.completedSubChapters || [],
        progressId: progress?._id || null,
      },
    };

    res.status(200).json({ success: true, data: courseWithProgress });
  } catch (error) {
    console.error("Error fetching course:", error);
    next(err);
  }
};
  
export const updateCourse = async (req, res) => {
  const { id } = req.params;
  const {  ...updateData } = req.body;
  try {
    const existingCourse = await Course.findById(id);

    if (!existingCourse) {
      throw createError(400, `Course not found`)
      //return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const updatedCourse = await Course.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      data: updatedCourse,
    });
  } catch (error) {
    console.error('Error updating course:', error);
    next(err)
  }
};
export const markSubChapterComplete = async (req, res) => {
  const studentId = req.user._id;
  const { courseId, subChapterId } = req.body;

  if (!courseId || !subChapterId) {
    throw createError(400, `Missing courseId or subChapterId`)
    //return res.status(400).json({ success: false, message: "Missing courseId or subChapterId" });
  }

  try {
    const progress = await Progress.findOneAndUpdate(
      { studentId, courseId },
      { $addToSet: { completedSubChapters: subChapterId } }, // prevents duplicates
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true, data: progress });
  } catch (error) {
    console.error('Error marking subchapter complete:', error);
    next(err);
  }
};


