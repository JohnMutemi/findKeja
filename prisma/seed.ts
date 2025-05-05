const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Create test users
  const landlordPassword = await hash('password123', 12);
  const tenantPassword = await hash('password123', 12);

  const landlord = await prisma.user.upsert({
    where: { email: 'landlord@example.com' },
    update: {},
    create: {
      email: 'landlord@example.com',
      name: 'John Doe',
      password: landlordPassword,
      role: 'LANDLORD',
    },
  });

  const tenant = await prisma.user.upsert({
    where: { email: 'tenant@example.com' },
    update: {},
    create: {
      email: 'tenant@example.com',
      name: 'Jane Smith',
      password: tenantPassword,
      role: 'TENANT',
    },
  });

  // Create test properties
  const properties = await Promise.all([
    prisma.property.create({
      data: {
        title: 'Modern Apartment in City Center',
        description: 'Beautiful modern apartment with great amenities',
        type: 'APARTMENT',
        status: 'AVAILABLE',
        price: 1500,
        address: '123 Main St',
        city: 'Nairobi',
        state: 'Nairobi',
        country: 'Kenya',
        latitude: -1.2921,
        longitude: 36.8219,
        bedrooms: 2,
        bathrooms: 2,
        area: 120,
        ownerId: landlord.id,
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
        ],
        amenities: ['Parking', 'Swimming Pool', 'Gym', 'Security'],
      },
    }),
    prisma.property.create({
      data: {
        title: 'Cozy Studio Near University',
        description: 'Perfect for students, fully furnished studio',
        type: 'STUDIO',
        status: 'AVAILABLE',
        price: 800,
        address: '456 College Ave',
        city: 'Nairobi',
        state: 'Nairobi',
        country: 'Kenya',
        latitude: -1.2921,
        longitude: 36.8219,
        bedrooms: 1,
        bathrooms: 1,
        area: 50,
        ownerId: landlord.id,
        images: [
          'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
        ],
        amenities: ['Furnished', 'Internet', 'Security'],
      },
    }),
    prisma.property.create({
      data: {
        title: 'Luxury House with Garden',
        description: 'Spacious house with beautiful garden',
        type: 'HOUSE',
        status: 'AVAILABLE',
        price: 2500,
        address: '789 Park Lane',
        city: 'Nairobi',
        state: 'Nairobi',
        country: 'Kenya',
        latitude: -1.2921,
        longitude: 36.8219,
        bedrooms: 4,
        bathrooms: 3,
        area: 250,
        ownerId: landlord.id,
        images: [
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
        ],
        amenities: ['Garden', 'Parking', 'Security', 'Swimming Pool'],
      },
    }),
  ]);

  // Create test conversation
  const conversation = await prisma.conversation.create({
    data: {
      participants: {
        connect: [{ id: landlord.id }, { id: tenant.id }],
      },
    },
  });

  // Create test messages
  await Promise.all([
    prisma.message.create({
      data: {
        content: 'I am interested in viewing this property. When is it available?',
        senderId: tenant.id,
        receiverId: landlord.id,
        conversationId: conversation.id,
      },
    }),
    prisma.message.create({
      data: {
        content: 'The property is available for viewing this weekend. Would you like to schedule a time?',
        senderId: landlord.id,
        receiverId: tenant.id,
        conversationId: conversation.id,
      },
    }),
    prisma.message.create({
      data: {
        content: 'Yes, I would like to schedule a viewing for Saturday at 2 PM.',
        senderId: tenant.id,
        receiverId: landlord.id,
        conversationId: conversation.id,
      },
    }),
  ]);

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
