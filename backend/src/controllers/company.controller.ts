import { type Request, type Response } from 'express';
import { PrismaClient } from '@prisma/client';
import logger from '../logger.js';

const prisma = new PrismaClient();

export const getCompanyProfile = async (req: Request, res: Response) => {
    const { user } = req;

    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const profile = await prisma.companyProfile.findUnique({
            where: { userId: user.id },
            include: { user: { select: { email: true, name: true, companyName: true } } }
        });
        res.json(profile);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: 'Could not fetch profile' });
    }
};

export const updateCompanyProfile = async (req: Request, res: Response) => {
    try {
        console.log('updateCompanyProfile hit');
        const { user } = req;

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        console.log('req.files type:', typeof req.files);
        console.log('req.files value:', req.files);
        console.log('Is array?', Array.isArray(req.files));

        const files = (req.files || {}) as { [fieldname: string]: Express.Multer.File[] };
        const data = req.body;
        console.log('Body keys:', Object.keys(data));

        const profileData: any = {
            userId: user.id,
            companyName: data.companyName,
            legalName: data.legalName,
            cinRegistration: data.cinRegistration,
            companyType: data.companyType,
            industrySector: data.industrySector,
            yearOfIncorporation: data.yearOfIncorporation,
            companySize: data.companySize,
            officialEmail: user.email,
            contactNumber: data.contactNumber,
            alternatePhone: data.alternatePhone || null,
            websiteUrl: data.websiteUrl,
            linkedinUrl: data.linkedinUrl || null,
            headOfficeAddress: data.headOfficeAddress,
            city: data.city,
            district: data.district,
            state: data.state,
            pinCode: data.pinCode,
            country: data.country,
            recruiterFirstName: data.recruiterFirstName,
            recruiterLastName: data.recruiterLastName,
            designation: data.designation,
            workEmail: data.workEmail,
            workContactNumber: data.workContactNumber,
            internshipTypes: data.internshipTypes,
            stipendOffered: data.stipendOffered,
            preferredSkills: data.preferredSkills,
            hiringVolume: data.hiringVolume,
            isCompleted: data.isCompleted === 'true' || data.isCompleted === true,
        };

        // Handle file uploads
        if (files.registrationProof?.[0]) {
            profileData.registrationProofUrl = `/uploads/company/${files.registrationProof[0].filename}`;
        }
        if (files.authLetter?.[0]) {
            profileData.authLetterUrl = `/uploads/company/${files.authLetter[0].filename}`;
        }
        if (files.companyLogo?.[0]) {
            profileData.companyLogoUrl = `/uploads/company/${files.companyLogo[0].filename}`;
        }

        // Mandatory validation commented out as per previous task

        const profile = await prisma.companyProfile.upsert({
            where: { userId: user.id },
            update: profileData,
            create: profileData,
        });

        res.json(profile);
    } catch (error: any) {
        console.error('Error in updateCompanyProfile:', error);
        res.status(500).json({ error: error.message || 'Could not update profile' });
    }
};
