import { Router } from 'express';
import { getCollegeProfile, updateCollegeProfile } from '../controllers/college.controller.js';
import { authMiddleware } from '../middleware/auth.js';
import { upload } from '../middleware/fileUpload.js';

const router = Router();

router.get('/profile', authMiddleware, getCollegeProfile);
router.put('/profile', authMiddleware, upload.fields([
    { name: 'idProof', maxCount: 1 },
    { name: 'authLetter', maxCount: 1 }
]), updateCollegeProfile);

// Student Approval Routes
import { getPendingStudents, approveStudent, getAllColleges, getApprovedStudents, getNOCRequests, updateNOCStatus } from '../controllers/college.controller.js';

router.get('/pending-students', authMiddleware, getPendingStudents);
router.get('/approved-students', authMiddleware, getApprovedStudents);
router.post('/approve-student/:studentId', authMiddleware, approveStudent);
router.get('/list', getAllColleges); // Public or authenticated? Let's keep it public for registration/profile
router.get('/noc-requests', authMiddleware, getNOCRequests);
router.put('/noc-requests/:applicationId', authMiddleware, updateNOCStatus);

export default router;
