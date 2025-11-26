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
    const fs = require('fs');
    fs.appendFileSync('debug_log.txt', `Controller Hit: Body keys: ${Object.keys(req.body).join(',')}\n`);
    const { user } = req;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const data = req.body;

        // Parse complex fields if they are sent as JSON strings (common with FormData)
        // For simple text fields, we can use them directly.
        // Note: req.body will contain text fields.

        const profileData: any = {
            userId: user.id,
            companyName: data.companyName,
            legalName: data.legalName,
            cinRegistration: data.cinRegistration,
            companyType: data.companyType,
            industrySector: data.industrySector,
            yearOfIncorporation: data.yearOfIncorporation,
            companySize: data.companySize,
            officialEmail: user.email, // Enforce login email
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
        if (files?.registrationProof?.[0]) {
            profileData.registrationProofUrl = `/uploads/company/${files.registrationProof[0].filename}`;
        }
        if (files?.authLetter?.[0]) {
            profileData.authLetterUrl = `/uploads/company/${files.authLetter[0].filename}`;
        }
        if (files?.companyLogo?.[0]) {
            profileData.companyLogoUrl = `/uploads/company/${files.companyLogo[0].filename}`;
        }

        // Validate mandatory fields if marking as completed
        if (data.isCompleted === 'true' || data.isCompleted === true) {
            const mandatoryFields = [
                'companyName', 'legalName', 'cinRegistration', 'companyType', 'industrySector', 'yearOfIncorporation', 'companySize',
                'contactNumber', 'websiteUrl',
                'headOfficeAddress', 'city', 'district', 'state', 'pinCode', 'country',
                'recruiterFirstName', 'recruiterLastName', 'designation', 'workEmail', 'workContactNumber'
            ];

            const missingFields = mandatoryFields.filter(field => !profileData[field]);
            if (missingFields.length > 0) {
                return res.status(400).json({ error: `Missing mandatory fields: ${missingFields.join(', ')}` });
            }

            // Check for registration proof (either newly uploaded or existing)
            if (!profileData.registrationProofUrl) {
                const existingProfile = await prisma.companyProfile.findUnique({ where: { userId: user.id } });
                if (!existingProfile?.registrationProofUrl) {
                    return res.status(400).json({ error: 'Company Registration Proof is mandatory' });
                }
            }
        }

        const profile = await prisma.companyProfile.upsert({
            where: { userId: user.id },
            update: profileData,
            create: profileData,
        });

        res.json(profile);
    } catch (error) {
        logger.error(error);
        const fs = require('fs');
        fs.appendFileSync('debug_log.txt', `Error: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}\nBody: ${JSON.stringify(req.body)}\n`);
        res.status(500).json({ error: 'Could not update profile' });
    }
};
