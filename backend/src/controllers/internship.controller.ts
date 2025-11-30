import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createInternship = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const {
            title,
            description,
            workMode,
            location,
            internshipType,
            duration,
            stipendType,
            stipendAmount,
            skills,
            openings,
            startDate,
            applicationDeadline,
            perks,
            eligibility,
            requirements
        } = req.body;

        // Verify user is an employer
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || user.roleId !== 2) { // 2 is Employer
            return res.status(403).json({ error: 'Only employers can post internships' });
        }

        const internship = await prisma.internship.create({
            data: {
                title,
                description,
                postedById: userId,
                workMode,
                location: workMode === 'Remote' ? null : location,
                internshipType,
                duration,
                stipendType,
                stipendAmount: stipendType === 'Unpaid' ? null : stipendAmount,
                skills,
                openings: Number(openings),
                startDate: new Date(startDate),
                applicationDeadline: new Date(applicationDeadline),
                perks,
                eligibility,
                requirements,
                status: 'Open'
            }
        });

        res.status(201).json(internship);
    } catch (error) {
        console.error('Create internship error:', error);
        res.status(500).json({ error: `Failed to create internship: ${error instanceof Error ? error.message : String(error)}` });
    }
};

export const getEmployerInternships = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const internships = await prisma.internship.findMany({
            where: { postedById: userId },
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { applications: true }
                }
            }
        });
        res.json(internships);
    } catch (error) {
        console.error('Get employer internships error:', error);
        res.status(500).json({ error: 'Failed to fetch internships' });
    }
};

export const getAllInternships = async (req: Request, res: Response) => {
    try {
        const internships = await prisma.internship.findMany({
            where: { status: 'Open' },
            orderBy: { createdAt: 'desc' },
            include: {
                postedBy: {
                    select: {
                        companyName: true,
                        companyProfile: {
                            select: {
                                companyLogoUrl: true,
                                city: true
                            }
                        }
                    }
                }
            }
        });
        res.json(internships);
    } catch (error) {
        console.error('Get all internships error:', error);
        res.status(500).json({ error: 'Failed to fetch internships' });
    }
};

export const getInternshipById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const internship = await prisma.internship.findUnique({
            where: { id: Number(id) },
            include: {
                postedBy: {
                    select: {
                        companyName: true,
                        companyProfile: {
                            select: {
                                companyLogoUrl: true,
                                websiteUrl: true,
                                description: true // Assuming description exists or similar field
                            }
                        }
                    }
                }
            }
        });

        if (!internship) {
            return res.status(404).json({ error: 'Internship not found' });
        }

        res.json(internship);
    } catch (error) {
        console.error('Get internship error:', error);
        res.status(500).json({ error: 'Failed to fetch internship details' });
    }
};
