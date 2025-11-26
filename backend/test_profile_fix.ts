
// Using global fetch and FormData


import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function test() {
    try {
        const email = `test_fix_${Date.now()}@example.com`;
        const password = 'password123';

        console.log('1. Registering...');
        const regRes = await fetch('http://localhost:5000/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email, password, name: 'Fix Tester', roleId: 1, collegeName: 'Test College'
            })
        });
        const regData = await regRes.json() as any;
        if (!regRes.ok) throw new Error('Register failed: ' + JSON.stringify(regData));
        console.log('Registered User ID:', regData.user.id);

        console.log('1.5 Verifying Email via Prisma...');
        await prisma.user.update({
            where: { email },
            data: { emailVerified: true }
        });


        console.log('2. Logging in...');
        const loginRes = await fetch('http://localhost:5000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const loginData = await loginRes.json() as any;
        if (!loginRes.ok) throw new Error('Login failed: ' + JSON.stringify(loginData));
        const token = loginData.accessToken;
        console.log('Got Token:', token ? 'Yes' : 'No');

        console.log('3. Updating Profile (Minimal)...');
        const formData = new FormData();
        formData.append('firstName', 'Test');
        formData.append('lastName', 'User');
        formData.append('fatherFirstName', 'Father');
        formData.append('fatherLastName', 'User');
        formData.append('motherFirstName', 'Mother');
        formData.append('motherLastName', 'User');
        formData.append('mobileNumber', '1234567890');
        formData.append('gender', 'Male');
        formData.append('dob', '2000-01-01');

        // Missing address and socialLinks intentionally
        // Missing arrays (education etc) - controller defaults them to []

        const profileRes = await fetch('http://localhost:5000/api/student/profile', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
                // Content-Type header for FormData is set automatically by fetch
            },
            body: formData
        });

        const profileData = await profileRes.json() as any;
        if (!profileRes.ok) {
            console.error('Profile Update Failed:', profileData);
            throw new Error('Profile Update Failed');
        }
        console.log('Profile Update Successful:', profileData.id);

    } catch (error) {
        console.error('Test Failed:', error);
        process.exit(1);
    }
}

test();
