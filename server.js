// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/studentDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Student Schema
const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    dateOfBirth: { type: Date, required: true },
    marks: {
        math: { type: Number, required: true, min: 0 },
        physics: { type: Number, required: true, min: 0 },
        chemistry: { type: Number, required: true, min: 0 },
    },
    cutoff: { type: Number, required: true },
});

const Student = mongoose.model('Student', studentSchema);

// API Endpoints

// 1. Create a Student
app.post('/api/students', async (req, res) => {
    const { name, email, dateOfBirth, math, physics, chemistry } = req.body;

    // Validate input values
    if (!name || !email || !dateOfBirth || math == null || physics == null || chemistry == null) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Calculate cutoff marks (average)
    const totalMarks = math + physics + chemistry;
    const averageMarks = totalMarks / 3;

    const newStudent = new Student({
        name,
        email,
        dateOfBirth,
        marks: { math, physics, chemistry },
        cutoff: averageMarks,
    });

    try {
        await newStudent.save();
        res.status(201).json({ message: 'Student data saved successfully', student: newStudent });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        res.status(500).json({ message: 'Error saving student data', error });
    }
});

// 2. Get All Students
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving student data', error });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
