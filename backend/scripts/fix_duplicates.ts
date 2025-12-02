import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Checking for duplicate applications...');

    const applications = await prisma.application.findMany();
    const seen = new Set();
    const duplicates = [];

    for (const app of applications) {
        const key = `${app.internshipId}-${app.studentId}`;
        if (seen.has(key)) {
            duplicates.push(app.id);
        } else {
            seen.add(key);
        }
    }

    console.log(`Found ${duplicates.length} duplicates.`);

    if (duplicates.length > 0) {
        console.log('Deleting duplicates...');
        await prisma.application.deleteMany({
            where: {
                id: {
                    in: duplicates
                }
            }
        });
        console.log('Duplicates deleted.');
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
