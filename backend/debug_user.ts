import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'muditcodes@gmail.com';
    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: { role: true },
        });

        if (user) {
            console.log('User found:');
            console.log(`ID: ${user.id}`);
            console.log(`Email: ${user.email}`);
            console.log(`Role ID: ${user.roleId}`);
            console.log(`Role Name: ${user.role.name}`);
            console.log(`Email Verified: ${user.emailVerified}`);
            // console.log(`Is Active: ${user.isActive}`); // Removed as it doesn't exist
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
