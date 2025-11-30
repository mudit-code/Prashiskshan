import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'muditcodes@gmail.com';
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (user) {
            console.log('User Lockout Status:');
            console.log(`Failed Login Attempts: ${user.failedLoginAttempts}`);
            console.log(`Lockout Until: ${user.lockoutUntil}`);
            console.log(`Current Time: ${new Date()}`);
        } else {
            console.log('User not found.');
        }
    } catch (error) {
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
