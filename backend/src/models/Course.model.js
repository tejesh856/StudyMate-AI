import mongoose from "mongoose";

const ContentBlockSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["text", "code"],
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
});

const StudyMaterialSchema = new mongoose.Schema({
  title: String,
  keyConcepts: [String],
  contentBlocks: [ContentBlockSchema],
  videoSuggestion: String,
});

const SubChapterSchema = new mongoose.Schema({
  title: String,
  description: String,
  includeVideo: Boolean,
  studyMaterial: StudyMaterialSchema,
});

const ChapterSchema = new mongoose.Schema({
  title: String,
  description: String,
  includeVideo: Boolean,
  subChapters:{
    type: [SubChapterSchema],
    default: [],
  },
});

const CourseSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  topicTitle: String,
  description: String,
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
  includevideo: Boolean,
  numofchapters: Number,
  image:{type:String,default:''},
  subject:{type:String,default:''},
  languageOrDomain:{type:String,default:''},
  chapters:  {
    type: [ChapterSchema],
    default: [],
  },
  status: {
  type: String,
  enum: ['pending', 'ready', 'failed'],
  default: 'pending'
},

  createdAt: {
    type: Date,
    default: null,
  },
});
/*CourseSchema.post("save", async function (doc, next) {
  try {
    // Update the corresponding CourseFlow with the newly created course's ID
    await CourseFlow.findByIdAndUpdate(doc.courseFlowId, {
      courseId: doc._id,
    });
    next();
  } catch (error) {
    console.error("Error updating CourseFlow with courseId:", error);
    next(error);
  }
});*/

export default mongoose.model("Course", CourseSchema);
