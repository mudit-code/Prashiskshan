import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const admin = await prisma.user.findFirst({
            where: { roleId: 3 }, // College Admin role
        });

        if (admin) {
            console.log('College Admin found:');
            console.log(`Email: ${admin.email}`);
            console.log(`Password Hash: ${admin.password.substring(0, 10)}...`);
        } else {
            console.log('No College Admin found.');
        }
    } catch (error) {
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
