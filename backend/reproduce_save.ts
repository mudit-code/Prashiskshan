import { PrismaClient } from '@prisma/client';

async function run() {
    const BASE_URL = 'http://127.0.0.1:5003';

    // 1. Register
    const email = `company_${Date.now()}@test.com`;
    const password = 'password123';
    console.log('Registering...', email);

    const regRes = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'Test Company',
            email,
            password,
            roleId: 2, // Company
            companyName: 'Test Company Inc'
        })
    });

    if (!regRes.ok) {
        console.error('Registration failed:', await regRes.text());
        return;
    }

    // Verify Email via Prisma
    const prisma = new PrismaClient();
    await prisma.user.update({
        where: { email },
        data: { emailVerified: true }
    });
    console.log('Email verified manually.');

    // 2. Login
    console.log('Logging in...');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    if (!loginRes.ok) {
        console.error('Login failed:', await loginRes.text());
        return;
    }

    const loginData = await loginRes.json();
    const token = loginData.accessToken;
    console.log('Got token:', token);

    // 3. Save Profile (Multipart)
    console.log('Saving profile...');
    const formData = new FormData();
    formData.append('companyName', 'Test Company Inc');
    formData.append('isCompleted', 'true');
    formData.append('yearOfIncorporation', '2022');

    const saveRes = await fetch(`${BASE_URL}/api/company/profile`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });

    console.log('Save status:', saveRes.status);
    const saveText = await saveRes.text();
    console.log('Save response:', saveText);
}

run().catch(console.error);
