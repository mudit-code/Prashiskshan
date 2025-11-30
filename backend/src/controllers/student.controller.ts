import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

export const getStudentProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const profile = await prisma.studentProfile.findUnique({
            where: { userId },
            include: {
                address: true,
                education: true,
                certifications: true,
                workExperience: true,
                socialLinks: true,
            },
        });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const createOrUpdateProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const data = req.body;

        // Parse JSON strings if they are sent as strings (multipart/form-data)
        const parsedData = {
            ...data,
            dob: data.dob ? new Date(data.dob) : undefined,
            education: typeof data.education === 'string' ? JSON.parse(data.education).map((e: any) => {
                const { id, profileId, marksheet, percentage, ...rest } = e;
                return {
                    ...rest,
                    cgpaOrPercentage: e.cgpaOrPercentage || percentage,
                    marksObtained: e.marksObtained ? parseFloat(e.marksObtained) : null,
                    maximumMarks: e.maximumMarks ? parseFloat(e.maximumMarks) : null,
                };
            }) : [],
            certifications: typeof data.certifications === 'string' ? JSON.parse(data.certifications).map((c: any) => {
                const { id, profileId, certificate, ...rest } = c;
                return rest;
            }) : [],
            workExperience: typeof data.workExperience === 'string' ? JSON.parse(data.workExperience).map((w: any) => {
                const { id, profileId, experienceLetter, ...rest } = w;
                return rest;
            }) : [],
            socialLinks: typeof data.socialLinks === 'string' ? (() => {
                const { id, profileId, ...rest } = JSON.parse(data.socialLinks);
                return rest;
            })() : undefined,
            address: typeof data.address === 'string' ? (() => {
                const { id, profileId, ...rest } = JSON.parse(data.address);
                return rest;
            })() : undefined,
        };

        // Handle file uploads
        const files = req.files as Express.Multer.File[] | undefined;

        if (files && Array.isArray(files)) {
            const photoFile = files.find(f => f.fieldname === 'photo');
            if (photoFile) parsedData.photoUrl = `/uploads/${photoFile.filename}`;

            const signatureFile = files.find(f => f.fieldname === 'signature');
            if (signatureFile) parsedData.signatureUrl = `/uploads/${signatureFile.filename}`;

            // Handle education files
            if (parsedData.education && Array.isArray(parsedData.education)) {
                parsedData.education = parsedData.education.map((edu: any, index: number) => {
                    const fileKey = `education_${index}_marksheet`;
                    const file = files.find(f => f.fieldname === fileKey);
                    if (file) {
                        return { ...edu, marksheetUrl: `/uploads/${file.filename}` };
                    }
                    return edu;
                });
            }

            // Handle certification files
            if (parsedData.certifications && Array.isArray(parsedData.certifications)) {
                parsedData.certifications = parsedData.certifications.map((cert: any, index: number) => {
                    const fileKey = `certification_${index}_certificate`;
                    const file = files.find(f => f.fieldname === fileKey);
                    if (file) {
                        return { ...cert, certificateUrl: `/uploads/${file.filename}` };
                    }
                    return cert;
                });
            }

            // Handle work experience files
            if (parsedData.workExperience && Array.isArray(parsedData.workExperience)) {
                parsedData.workExperience = parsedData.workExperience.map((exp: any, index: number) => {
                    const fileKey = `experience_${index}_letter`;
                    const file = files.find(f => f.fieldname === fileKey);
                    if (file) {
                        return { ...exp, experienceLetterUrl: `/uploads/${file.filename}` };
                    }
                    return exp;
                });
            }
        }

        // Upsert profile
        // Construct update and create objects
        // Upsert profile
        const updateData: any = {
            firstName: parsedData.firstName,
            middleName: parsedData.middleName,
            lastName: parsedData.lastName,
            fatherFirstName: parsedData.fatherFirstName,
            fatherMiddleName: parsedData.fatherMiddleName,
            fatherLastName: parsedData.fatherLastName,
            motherFirstName: parsedData.motherFirstName,
            motherMiddleName: parsedData.motherMiddleName,
            motherLastName: parsedData.motherLastName,
            mobileNumber: parsedData.mobileNumber,
            gender: parsedData.gender,
            dob: parsedData.dob,
            photoUrl: parsedData.photoUrl,
            signatureUrl: parsedData.signatureUrl,
            isCompleted: parsedData.isCompleted === 'true' || parsedData.isCompleted === true,
            approvalStatus: 'Pending', // Reset to pending on update if critical fields change? Or just default.
            // For arrays (education, certifications, workExperience), we'll delete and recreate for simplicity
            education: {
                deleteMany: {},
                create: parsedData.education,
            },
            certifications: {
                deleteMany: {},
                create: parsedData.certifications,
            },
            workExperience: {
                deleteMany: {},
                create: parsedData.workExperience,
            },
        };

        const createData: any = {
            userId,
            firstName: parsedData.firstName,
            middleName: parsedData.middleName,
            lastName: parsedData.lastName,
            fatherFirstName: parsedData.fatherFirstName,
            fatherMiddleName: parsedData.fatherMiddleName,
            fatherLastName: parsedData.fatherLastName,
            motherFirstName: parsedData.motherFirstName,
            motherMiddleName: parsedData.motherMiddleName,
            motherLastName: parsedData.motherLastName,
            mobileNumber: parsedData.mobileNumber,
            gender: parsedData.gender,
            dob: parsedData.dob,
            photoUrl: parsedData.photoUrl,
            signatureUrl: parsedData.signatureUrl,
            isCompleted: parsedData.isCompleted === 'true' || parsedData.isCompleted === true,
            approvalStatus: 'Pending',
            education: {
                create: parsedData.education,
            },
            certifications: {
                create: parsedData.certifications,
            },
            workExperience: {
                create: parsedData.workExperience,
            },
        };

        // Update User's collegeId if provided
        if (parsedData.collegeId) {
            await prisma.user.update({
                where: { id: userId },
                data: { collegeId: Number(parsedData.collegeId) }
            });
        }

        // Validate mandatory fields if marking as completed
        if (parsedData.isCompleted === 'true' || parsedData.isCompleted === true) {
            const mandatoryFields = [
                'firstName', 'lastName', 'mobileNumber', 'dob', 'gender',
                'fatherFirstName', 'fatherLastName', 'motherFirstName', 'motherLastName'
            ];
            const missingFields = mandatoryFields.filter(field => !parsedData[field]);

            if (missingFields.length > 0) {
                return res.status(400).json({ error: `Missing mandatory fields: ${missingFields.join(', ')}` });
            }

            if (!parsedData.address || !parsedData.address.city || !parsedData.address.state || !parsedData.address.pinCode) {
                return res.status(400).json({ error: 'Address (City, State, PIN Code) is mandatory' });
            }

            // Check 10th details
            const tenth = parsedData.education.find((e: any) => e.level === '10th');
            if (!tenth || !tenth.yearOfPassing || !tenth.boardName || !tenth.marksObtained || !tenth.maximumMarks) {
                return res.status(400).json({ error: '10th Standard details are mandatory' });
            }
        }

        // Conditionally add address if present
        if (parsedData.address) {
            updateData.address = {
                upsert: {
                    create: parsedData.address,
                    update: parsedData.address,
                },
            };
            createData.address = {
                create: parsedData.address,
            };
        }

        // Conditionally add socialLinks if present
        if (parsedData.socialLinks) {
            updateData.socialLinks = {
                upsert: {
                    create: parsedData.socialLinks,
                    update: parsedData.socialLinks,
                },
            };
            createData.socialLinks = {
                create: parsedData.socialLinks,
            };
        }

        // Upsert profile
        const profile = await prisma.studentProfile.upsert({
            where: { userId },
            update: updateData,
            create: createData,
        });

        res.json(profile);
    } catch (error) {
        console.error('Error saving profile:', error);
        console.error('Request body:', req.body);
        res.status(500).json({ message: 'Server error', error: String(error) });
    }
};

export const linkCollege = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { collegeId, rollNo, course, branch, year, section, collegeEmail } = req.body;

        if (!collegeId) {
            return res.status(400).json({ error: 'College ID is required' });
        }

        const college = await prisma.user.findUnique({
            where: { id: Number(collegeId), roleId: 3 }, // Ensure it's a college admin
        });

        if (!college) {
            return res.status(404).json({ error: 'College not found' });
        }

        // Handle ID Card upload
        let collegeIdCardUrl = null;
        const files = req.files as Express.Multer.File[] | undefined;
        if (files && Array.isArray(files)) {
            const idCardFile = files.find(f => f.fieldname === 'collegeIdCard');
            if (idCardFile) {
                collegeIdCardUrl = `/uploads/${idCardFile.filename}`;
            }
        }

        await prisma.user.update({
            where: { id: userId },
            data: {
                collegeId: Number(collegeId),
            },
        });

        // Update profile with verification details
        await prisma.studentProfile.updateMany({
            where: { userId },
            data: {
                approvalStatus: 'Pending',
                rollNo,
                course,
                branch,
                year,
                section,
                collegeEmail,
                collegeIdCardUrl: collegeIdCardUrl || undefined
            }
        });

        res.json({ message: 'College verification request sent successfully. Please wait for approval.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
