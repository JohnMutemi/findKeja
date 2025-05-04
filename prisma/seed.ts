const {
  PrismaClient,
  ReportStatus,
  ReportType,
  UserRole,
  PropertyStatus,
} = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await hash('admin123', 12);
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@findkeja.com',
      password: adminPassword,
      role: UserRole.ADMIN,
    },
  });

  // Create landlords
  const landlordPassword = await hash('landlord123', 12);
  const landlords = await Promise.all(
    ['John Doe', 'Jane Smith', 'Mike Johnson'].map((name) =>
      prisma.user.create({
        data: {
          name,
          email: `${name.toLowerCase().replace(' ', '')}@example.com`,
          password: landlordPassword,
          role: UserRole.LANDLORD,
        },
      })
    )
  );

  // Create tenants
  const tenantPassword = await hash('tenant123', 12);
  const tenants = await Promise.all(
    ['Alice Brown', 'Bob Wilson', 'Carol Davis'].map((name) =>
      prisma.user.create({
        data: {
          name,
          email: `${name.toLowerCase().replace(' ', '')}@example.com`,
          password: tenantPassword,
          role: UserRole.TENANT,
        },
      })
    )
  );

  // Create properties
  const properties = await Promise.all(
    landlords.flatMap((landlord) =>
      Array.from({ length: 2 }, (_, i) =>
        prisma.property.create({
          data: {
            title: `${landlord.name}'s Property ${i + 1}`,
            description: `A beautiful property in Kitengela with ${
              2 + i
            } bedrooms`,
            price: 15000 + i * 5000,
            status: i === 0 ? PropertyStatus.AVAILABLE : PropertyStatus.RENTED,
            ownerId: landlord.id,
          },
        })
      )
    )
  );

  // Create conversations and messages
  for (const tenant of tenants) {
    for (const landlord of landlords) {
      const conversation = await prisma.conversation.create({
        data: {
          participants: {
            connect: [{ id: tenant.id }, { id: landlord.id }],
          },
        },
      });

      // Create some messages
      await Promise.all(
        Array.from({ length: 3 }, (_, i) =>
          prisma.message.create({
            data: {
              content: `Message ${i + 1} from ${
                i % 2 === 0 ? tenant.name : landlord.name
              }`,
              senderId: i % 2 === 0 ? tenant.id : landlord.id,
              receiverId: i % 2 === 0 ? landlord.id : tenant.id,
              conversationId: conversation.id,
            },
          })
        )
      );
    }
  }

  // Create reports
  const reportTypes = [
    ReportType.SCAM,
    ReportType.INAPPROPRIATE,
    ReportType.FAKE_LISTING,
    ReportType.OTHER,
  ];
  const reportStatuses = [
    ReportStatus.PENDING,
    ReportStatus.RESOLVED,
    ReportStatus.DISMISSED,
  ];

  await Promise.all(
    Array.from({ length: 5 }, (_, i) =>
      prisma.report.create({
        data: {
          type: reportTypes[i % reportTypes.length],
          description: `Report ${i + 1}: ${reportTypes[
            i % reportTypes.length
          ].toLowerCase()} issue`,
          status: reportStatuses[i % reportStatuses.length],
        },
      })
    )
  );

  console.log('Database has been seeded. 🌱');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
