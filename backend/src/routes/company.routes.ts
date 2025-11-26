import express from 'express';
import { getCompanyProfile, updateCompanyProfile } from '../controllers/company.controller.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/company';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only images and PDFs are allowed'));
        }
    }
});

router.get('/profile', authMiddleware, requireRole('Company'), getCompanyProfile);

router.post('/profile',
    authMiddleware,
    requireRole('Company'),
    upload.fields([
        { name: 'registrationProof', maxCount: 1 },
        { name: 'authLetter', maxCount: 1 },
        { name: 'companyLogo', maxCount: 1 }
    ]),
    updateCompanyProfile
);

export default router;
