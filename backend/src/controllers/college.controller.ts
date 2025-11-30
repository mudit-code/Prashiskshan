import { type Request, type Response } from 'express';
import { PrismaClient } from '@prisma/client';
import logger from '../logger.js';

const prisma = new PrismaClient();

export const getCollegeProfile = async (req: Request, res: Response) => {
    const { user } = req;

    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const profile = await prisma.collegeProfile.findUnique({
            where: { userId: user.id },
            include: { user: { select: { email: true, name: true, collegeName: true } } }
        });
        res.json(profile);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: 'Could not fetch profile' });
    }
};

export const updateCollegeProfile = async (req: Request, res: Response) => {
    const { user } = req;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const data = req.body;

        const profileData: any = {
            userId: user.id,
            // Personal
            firstName: data.firstName,
            middleName: data.middleName || null,
            lastName: data.lastName,
            designation: data.designation,
            department: data.department,
            officialEmail: user.email, // Enforce login email
            mobileNumber: data.mobileNumber,
            alternateMobileNumber: data.alternateMobileNumber || null,
            gender: data.gender,

            // College
            collegeName: data.collegeName,
            collegeCode: data.collegeCode,
            university: data.university,
            collegeType: data.collegeType,
            websiteUrl: data.websiteUrl || null,
            collegeEmail: data.collegeEmail || null,
            yearOfEstablishment: data.yearOfEstablishment || null,

            // Address
            campusAddress: data.campusAddress,
            city: data.city,
            district: data.district,
            state: data.state,
            pinCode: data.pinCode,

            isCompleted: data.isCompleted === 'true' || data.isCompleted === true,
        };

        // Handle file uploads
        if (files?.idProof?.[0]) {
            profileData.idProofUrl = `/uploads/college/${files.idProof[0].filename}`;
        }
        if (files?.authLetter?.[0]) {
            profileData.authLetterUrl = `/uploads/college/${files.authLetter[0].filename}`;
        }

        // Validate mandatory fields if marking as completed
        if (data.isCompleted === 'true' || data.isCompleted === true) {
            const mandatoryFields = [
                'firstName', 'lastName', 'designation', 'department', 'mobileNumber', 'gender',
                'collegeName', 'collegeCode', 'university', 'collegeType',
                'campusAddress', 'city', 'district', 'state', 'pinCode'
            ];

            const missingFields = mandatoryFields.filter(field => !profileData[field]);
            if (missingFields.length > 0) {
                return res.status(400).json({ error: `Missing mandatory fields: ${missingFields.join(', ')}` });
            }

            // Check for proofs (either newly uploaded or existing)
            if (!profileData.idProofUrl && !profileData.authLetterUrl) {
                const existingProfile = await prisma.collegeProfile.findUnique({ where: { userId: user.id } });
                if (!existingProfile?.idProofUrl && !profileData.idProofUrl) {
                    return res.status(400).json({ error: 'ID Proof is mandatory' });
                }
                if (!existingProfile?.authLetterUrl && !profileData.authLetterUrl) {
                    return res.status(400).json({ error: 'Authorization Letter is mandatory' });
                }
            }
        }

        const profile = await prisma.collegeProfile.upsert({
            where: { userId: user.id },
            update: profileData,
            create: profileData,
        });

        res.json(profile);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: 'Could not update profile' });
    }
};

export const getPendingStudents = async (req: Request, res: Response) => {
    const { user } = req;

    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        // Find students who have selected this college (via user.collegeId) and are pending approval
        const students = await prisma.studentProfile.findMany({
            where: {
                user: {
                    collegeId: user.id // The student's collegeId points to the College Admin's User ID
                },
                approvalStatus: 'Pending',
                isCompleted: true // Only show completed profiles
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                education: true // Include education details for review
            }
        });

        res.json(students);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: 'Could not fetch pending students' });
    }
};

export const getApprovedStudents = async (req: Request, res: Response) => {
    const { user } = req;

    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const students = await prisma.studentProfile.findMany({
            where: {
                user: {
                    collegeId: user.id
                },
                approvalStatus: 'Approved'
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                education: true
            }
        });

        res.json(students);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: 'Could not fetch approved students' });
    }
};

export const approveStudent = async (req: Request, res: Response) => {
    const { user } = req;
    const { studentId } = req.params;
    const { status } = req.body; // "Approved" or "Rejected"

    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!['Approved', 'Rejected'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    try {
        // Verify the student belongs to this college
        const studentProfile = await prisma.studentProfile.findUnique({
            where: { id: Number(studentId) },
            include: { user: true }
        });

        if (!studentProfile || studentProfile.user.collegeId !== user.id) {
            return res.status(404).json({ error: 'Student not found or not belonging to your college' });
        }

        const updatedProfile = await prisma.studentProfile.update({
            where: { id: Number(studentId) },
            data: { approvalStatus: status }
        });

        res.json(updatedProfile);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: 'Could not update student status' });
    }
};

export const getAllColleges = async (_req: Request, res: Response) => {
    try {
        // Fetch all users with role 'Admin' (College Admin) who have a college name
        // We return the User ID as the 'id' because that's what we link to in User.collegeId
        const colleges = await prisma.user.findMany({
            where: {
                roleId: 3, // College Admin
                collegeName: { not: null }
            },
            select: {
                id: true,
                collegeName: true,
                aisheCode: true
            }
        });
        res.json(colleges);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: 'Could not fetch colleges' });
    }
};
