import Quiz from "../models/quiz.js";

export const createQuiz = async (req, res) => {
    try {
        const { title, questions } = req.body;
        const code = Math.random().toString(36).substring(2, 8);
        const quiz = new Quiz({ title, questions, code, createdAt: new Date() });
        await quiz.save();
        res.status(201).json({ message: "Quiz created successfully", code });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getQuizByCode = async (req, res) => {
    try {
        const quiz = await Quiz.findOne({ code: req.params.code });
        if (!quiz) return res.status(404).json({ message: "Quiz not found" });
        res.status(200).json(quiz);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find().sort({ createdAt: -1 });
        res.status(200).json({ quizzes });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
