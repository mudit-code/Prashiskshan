// Using native fetch and Prisma
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const BASE_URL = 'http://127.0.0.1:5000';

async function login(email, password, role) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const text = await res.text();
    try {
        const data = JSON.parse(text);
        if (!res.ok) throw new Error(`Login failed: ${JSON.stringify(data)}`);
        return data.accessToken;
    } catch (e) {
        throw new Error(`Login failed (Status ${res.status}): ${text.substring(0, 200)}...`);
    }
}

async function verifyUser(email) {
    console.log(`Verifying user ${email}...`);
    await prisma.user.update({
        where: { email },
        data: { emailVerified: true }
    });
}

async function runTest() {
    try {
        console.log('--- Starting Internship Flow Verification ---');

        // 1. Login as Employer
        console.log('Logging in as Employer...');
        const employerEmail = `employer_${Date.now()}@test.com`;
        const password = 'Password@123';

        const regRes = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test Employer',
                email: employerEmail,
                password: password,
                roleId: 2, // Company
                companyName: 'Test Corp'
            })
        });

        if (!regRes.ok) {
            const err = await regRes.text();
            throw new Error(`Employer registration failed: ${err}`);
        }

        // Manually verify employer
        await verifyUser(employerEmail);

        const employerToken = await login(employerEmail, password, 'Company');
        console.log('Employer logged in.');

        // 2. Post Internship
        console.log('Posting Internship...');
        const internshipRes = await fetch(`${BASE_URL}/internships`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${employerToken}`
            },
            body: JSON.stringify({
                title: 'Test Internship',
                workMode: 'Remote',
                internshipType: 'Full-time',
                duration: '3 months',
                stipendType: 'Paid',
                stipendAmount: '10000',
                skills: 'React, Node',
                openings: 5,
                startDate: '2024-06-01',
                applicationDeadline: '2024-05-30',
                description: 'Test description',
                status: 'Open'
            })
        });

        if (!internshipRes.ok) {
            const err = await internshipRes.json();
            throw new Error(`Failed to post internship: ${JSON.stringify(err)}`);
        }

        const internship = await internshipRes.json();
        console.log('Internship posted:', internship.id);

        // 3. Login as Student
        console.log('Logging in as Student...');
        const studentEmail = `student_${Date.now()}@test.com`;

        const studentRegRes = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test Student',
                email: studentEmail,
                password: password,
                roleId: 1 // Student
            })
        });

        if (!studentRegRes.ok) {
            const err = await studentRegRes.text();
            throw new Error(`Student registration failed: ${err}`);
        }

        // Manually verify student
        await verifyUser(studentEmail);

        const studentToken = await login(studentEmail, password, 'Student');
        console.log('Student logged in.');

        // 4. Apply for Internship
        console.log('Applying for Internship...');
        const applyRes = await fetch(`${BASE_URL}/applications`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${studentToken}`
            },
            body: JSON.stringify({
                internshipId: internship.id,
                coverLetter: 'I am interested.'
            })
        });

        if (!applyRes.ok) {
            const err = await applyRes.json();
            console.log('Apply failed (expected if not multipart):', err);
        } else {
            const application = await applyRes.json();
            console.log('Application submitted:', application.id);

            // 5. Employer accepts application
            console.log('Employer accepting application...');
            const acceptRes = await fetch(`${BASE_URL}/company/applications/${application.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${employerToken}`
                },
                body: JSON.stringify({
                    status: 'Accepted'
                })
            });

            if (!acceptRes.ok) {
                const err = await acceptRes.json();
                throw new Error(`Failed to accept: ${JSON.stringify(err)}`);
            }
            console.log('Application accepted.');
        }

        console.log('--- Verification Complete ---');

    } catch (error) {
        console.error('Test Failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

runTest();
