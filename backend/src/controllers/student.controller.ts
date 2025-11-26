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
                const { id, profileId, marksheet, ...rest } = e;
                return {
                    ...rest,
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
        const profile = await prisma.studentProfile.upsert({
            where: { userId },
            update: {
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
                address: {
                    upsert: {
                        create: parsedData.address,
                        update: parsedData.address,
                    },
                },
                socialLinks: {
                    upsert: {
                        create: parsedData.socialLinks,
                        update: parsedData.socialLinks,
                    },
                },
                // For arrays (education, certifications, workExperience), we'll delete and recreate for simplicity in this iteration
                // A better approach would be to update existing records by ID
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
            },
            create: {
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
                address: {
                    create: parsedData.address,
                },
                socialLinks: {
                    create: parsedData.socialLinks,
                },
                education: {
                    create: parsedData.education,
                },
                certifications: {
                    create: parsedData.certifications,
                },
                workExperience: {
                    create: parsedData.workExperience,
                },
            },
        });

        res.json(profile);
    } catch (error) {
        console.error('Error saving profile:', error);
        console.error('Request body:', req.body);
        res.status(500).json({ message: 'Server error', error: String(error) });
    }
};
