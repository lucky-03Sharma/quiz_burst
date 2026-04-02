import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: Number,
});

const quizSchema = new mongoose.Schema({
  title: String,
  code: { type: String, unique: true },
  category: { type: String, default: "" },
  difficulty: { type: String, default: "" },
  questions: [questionSchema],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Quiz", quizSchema);
