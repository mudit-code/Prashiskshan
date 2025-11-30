import express from 'express';
import multer from 'multer';
import path from 'path';
import { getStudentProfile, createOrUpdateProfile, linkCollege } from '../controllers/student.controller.js';
import { authMiddleware as authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        // Basic file type check (can be expanded)
        if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only images and PDFs are allowed'));
        }
    }
});

// Define fields for upload
const uploadFields = [
    { name: 'photo', maxCount: 1 },
    { name: 'signature', maxCount: 1 },
    // Dynamic fields for education, certifications, experience are tricky with multer's fields array
    // We'll allow a generous number of generic fields or use any() if needed, but fields() is safer
    // For now, let's try to anticipate some keys or use any() and validate in controller
    // Using any() for simplicity with dynamic keys
];

router.get('/profile', authenticateToken, getStudentProfile);
router.post('/profile', authenticateToken, upload.any(), createOrUpdateProfile);
router.post('/link-college', authenticateToken, upload.any(), linkCollege);

export default router;
