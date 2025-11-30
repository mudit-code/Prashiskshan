import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'v0@gmail.com';
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (user) {
        console.log(`Email Verified: ${user.emailVerified}`);
        console.log(`Verification Token: ${user.emailVerificationToken}`);
        if (user.emailVerificationToken) {
            console.log(`Verification URL: http://localhost:3000/auth/verify-email?token=${user.emailVerificationToken}`);
        }
    } else {
        console.log('User not found');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
