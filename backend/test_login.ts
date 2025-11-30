async function login() {
    try {
        const response = await fetch('http://127.0.0.1:5000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'muditcodes@gmail.com',
                password: 'password123',
            }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Login Successful!');
            console.log('Access Token:', data.accessToken);
        } else {
            const errorData = await response.json();
            console.log('Login Failed!');
            console.log('Status:', response.status);
            console.log('Data:', errorData);
        }
    } catch (error: any) {
        console.error('Login failed:', error.message || error);
    }
}

login();
