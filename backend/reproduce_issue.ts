
async function register() {
    try {
        const response = await fetch('http://localhost:5000/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: `test_${Date.now()}@example.com`,
                password: 'password123',
                name: 'Test User',
                roleId: 1, // Student
                collegeName: 'Test College',
            }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(JSON.stringify(data));
        }
        console.log('Registration successful:', data);
    } catch (error) {
        console.error('Registration failed:', error);
    }
}

register();
