import fs from 'fs';


async function reproduce() {
    try {
        // 1. Login
        const loginRes = await fetch('http://127.0.0.1:5000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: '233256@kit.ac.in', password: 'password123' }),
        });

        if (!loginRes.ok) {
            console.log('Login failed:', await loginRes.text());
            return;
        }

        const { accessToken } = (await loginRes.json()) as any;
        console.log('Login successful. Token:', accessToken);

        // 2. Update Profile with Large File
        const formData = new FormData();
        formData.append('firstName', 'Admin');
        formData.append('lastName', 'User');
        formData.append('isCompleted', 'true');

        // Read large file
        const fileBuffer = fs.readFileSync('large_file.pdf');
        const blob = new Blob([fileBuffer]);
        formData.append('idProof', blob, 'large_file.pdf');

        const updateRes = await fetch('http://127.0.0.1:5000/api/college/profile', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            body: formData,
        });

        // Check if response is JSON
        const contentType = updateRes.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const updateData = await updateRes.json();
            console.log('Update Status:', updateRes.status);
            console.log('Update Response:', updateData);
        } else {
            console.log('Update Status:', updateRes.status);
            console.log('Update Response Text:', await updateRes.text());
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

reproduce();
