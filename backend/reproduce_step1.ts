
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
    try {
        const email = `test_company_step1_${Date.now()}@example.com`;
        const password = 'password123';

        console.log('1. Registering Company...');
        const regRes = await fetch('http://localhost:5000/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email, password, name: 'Test Company Step1', roleId: 2, companyName: 'Test Corp Step1'
            })
        });
        const regData = await regRes.json() as any;
        if (!regRes.ok) throw new Error('Register failed: ' + JSON.stringify(regData));
        console.log('Registered Company ID:', regData.user.id);

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
        console.log('Got Token');

        console.log('3. Updating Company Profile (Step 1)...');
        const formData = new FormData();
        // Step 1 Fields
        formData.append('companyName', 'Test Corp Step1');
        formData.append('legalName', 'Test Corp Legal');
        formData.append('cinRegistration', 'U12345MH2023PTC123456');
        formData.append('companyType', 'Startup');
        formData.append('industrySector', 'IT');
        formData.append('yearOfIncorporation', '2022');
        formData.append('companySize', '1-10');

        // isCompleted is false for Step 1
        formData.append('isCompleted', 'false');

        // No files uploaded in Step 1

        const profileRes = await fetch('http://localhost:5000/api/company/profile', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
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
    } finally {
        await prisma.$disconnect();
    }
}

test();
