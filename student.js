// student-info-backend/models/Student.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    dateOfBirth: { type: Date, required: true },
    marks: {
        math: { type: Number, required: true },
        physics: { type: Number, required: true },
        chemistry: { type: Number, required: true },
    },
    cutoff: { type: Number },
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
