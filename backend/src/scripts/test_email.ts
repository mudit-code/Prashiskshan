

const API_URL = 'http://localhost:5000';

async function testEmailVerification() {
    const email = `test.user.${Date.now()}@example.com`;
    const password = 'password123';
    const name = 'Test User';
    const roleId = 1; // Assuming 1 is Student

    console.log(`Attempting to register user with email: ${email}`);

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
                name,
                roleId,
                collegeName: 'Test College',
            }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Registration successful:', data);
            console.log('Check backend logs for "Verification email sent" message.');
        } else {
            console.error('Registration failed:', data);
        }
    } catch (error) {
        console.error('Error during registration:', error);
    }
}

testEmailVerification();
