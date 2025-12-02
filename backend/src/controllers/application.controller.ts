import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const applyForInternship = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { internshipId, coverLetter } = req.body;

        // Handle file upload (resume)
        // Assuming multer middleware puts file in req.file or req.files
        // For now, let's assume the file URL is passed in body or handled separately
        // But typically we want to handle file upload here. 
        // Let's assume the frontend uploads to a separate endpoint or we use the existing upload middleware.
        // Given the previous patterns, let's assume req.files contains the uploaded files.

        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
        let resumeUrl = null;

        if (files && files['resume'] && files['resume'][0]) {
            // In a real app, upload to S3/Cloudinary. Here we might just store the path or assume local storage.
            // Based on previous code, it seems we store local paths or URLs.
            // Let's assume the file upload middleware populates req.files and we construct the URL.
            resumeUrl = `uploads/${files['resume'][0].filename}`;
        }

        // Check if already applied
        const existingApplication = await prisma.application.findFirst({
            where: {
                internshipId: Number(internshipId),
                studentId: userId
            }
        });

        if (existingApplication) {
            return res.status(400).json({ error: 'You have already applied for this internship' });
        }

        const application = await prisma.application.create({
            data: {
                internshipId: Number(internshipId),
                studentId: userId,
                status: 'Pending',
                coverLetter,
                resumeUrl
            }
        });

        res.status(201).json(application);
    } catch (error) {
        console.error('Apply internship error:', error);
        res.status(500).json({ error: 'Failed to submit application' });
    }
};

export const getInternshipApplications = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { internshipId } = req.params;

        // Verify the internship belongs to the employer
        const internship = await prisma.internship.findUnique({
            where: { id: Number(internshipId) }
        });

        if (!internship || internship.postedById !== userId) {
            return res.status(403).json({ error: 'Unauthorized access to applications' });
        }

        const applications = await prisma.application.findMany({
            where: { internshipId: Number(internshipId) },
            include: {
                student: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        studentProfile: {
                            select: {
                                mobileNumber: true,
                                education: true,

                                // Checked schema: StudentProfile doesn't have 'skills' field explicitly in the schema I saw earlier?
                                // Wait, let me check schema again. 
                                // StudentProfile has education, certifications, etc.
                                // It does NOT have a 'skills' field. 
                                // I will just return what is available.
                            }
                        }
                    }
                }
            }
        });

        res.json(applications);
    } catch (error) {
        console.error('Get applications error:', error);
        res.status(500).json({ error: 'Failed to fetch applications' });
    }
};

export const updateApplicationStatus = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { applicationId } = req.params;
        const { status } = req.body; // "Accepted", "Rejected"

        const application = await prisma.application.findUnique({
            where: { id: Number(applicationId) },
            include: { internship: true }
        });

        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }

        // Verify employer owns the internship
        if (application.internship.postedById !== userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        // Handle Offer Letter Upload if Accepted
        let offerLetterUrl = application.offerLetterUrl;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

        if (status === 'Accepted' && files && files['offerLetter'] && files['offerLetter'][0]) {
            offerLetterUrl = `uploads/${files['offerLetter'][0].filename}`;
        }

        const updatedApplication = await prisma.application.update({
            where: { id: Number(applicationId) },
            data: {
                status,
                offerLetterUrl
            }
        });

        res.json(updatedApplication);
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ error: 'Failed to update application status' });
    }
};

export const getStudentApplications = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const applications = await prisma.application.findMany({
            where: { studentId: userId },
            include: {
                internship: {
                    include: {
                        postedBy: {
                            select: { companyName: true }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(applications);
    } catch (error) {
        console.error('Get student applications error:', error);
        res.status(500).json({ error: 'Failed to fetch applications' });
    }
};

export const requestNOC = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { applicationId } = req.params;

        const application = await prisma.application.findUnique({
            where: { id: Number(applicationId) },
            include: { internship: true }
        });

        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }

        if (application.studentId !== userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        if (application.status !== 'Accepted') {
            return res.status(400).json({ error: 'You can only request NOC for accepted internships' });
        }

        if (application.nocStatus) {
            return res.status(400).json({ error: `NOC already ${application.nocStatus}` });
        }

        const updatedApplication = await prisma.application.update({
            where: { id: Number(applicationId) },
            data: {
                nocStatus: 'Requested'
            }
        });

        res.json(updatedApplication);
    } catch (error) {
        console.error('Request NOC error:', error);
        res.status(500).json({ error: 'Failed to request NOC' });
    }
};
