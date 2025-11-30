
import axios from 'axios';

const API_URL = 'http://localhost:5000';

async function testShortDescription() {
    try {
        // Login as employer first (using the one from verification script)
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'employer_1764518594191@test.com', // Use a known user or create one
            password: 'password123'
        });
        const token = loginRes.data.accessToken;

        console.log('Logged in, token:', token);

        try {
            await axios.post(`${API_URL}/internships`, {
                title: 'Test Internship',
                description: 'Short', // < 10 chars
                workMode: 'Remote',
                internshipType: 'Full-time',
                duration: '3 months',
                stipendType: 'Unpaid',
                skills: 'React',
                openings: 1,
                startDate: '2025-01-01',
                applicationDeadline: '2025-01-01'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error: any) {
            console.log('Error response status:', error.response?.status);
            console.log('Error response data:', JSON.stringify(error.response?.data, null, 2));
        }

    } catch (error) {
        console.error('Setup failed:', error);
    }
}

testShortDescription();
