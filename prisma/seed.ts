import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Crear evento
  const event = await prisma.event.upsert({
    where: { publicId: 'baby-shower-2024' },
    update: {},
    create: {
      publicId: 'baby-shower-2024',
      title: 'Baby Shower',
      babyName: 'Nuestro bebé',
      description: 'Un momento especial para compartir con nuestros seres queridos.',
      eventDate: new Date('2024-12-15'),
      eventTime: '15:00',
      location: 'Salón de Eventos Los Olivos',
      address: 'Av. Principal 123, Ciudad',
      latitude: 4.6097,
      longitude: -74.0817,
      storyTitle: 'Nuestra historia',
      storyContent: 'Comenzamos este viaje con mucha emoción y amor...',
      isRevealed: false,
      primaryColor: '#8B7355',
      secondaryColor: '#D4C4B7',
      metaTitle: 'Baby Shower - Bienvenidos',
      metaDescription: 'Únete a nosotros para celebrar la llegada de nuestro bebé.',
    },
  });
  console.log(`✅ Event created: ${event.title}`);

  // Crear usuario admin
  const passwordHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin@babyshower.com' },
    update: {},
    create: {
      email: 'admin@babyshower.com',
      passwordHash,
      name: 'Administrador',
      eventId: event.id,
    },
  });
  console.log(`✅ Admin created: ${admin.email}`);

  // Crear invitados de ejemplo
  const guests = await Promise.all([
    prisma.guest.upsert({
      where: { invitationCode: 'BS-7K92' },
      update: {},
      create: {
        publicId: 'guest-1',
        eventId: event.id,
        name: 'María García',
        phone: '+573001234567',
        email: 'maria@example.com',
        invitationCode: 'BS-7K92',
        attendanceStatus: 'PENDING',
      },
    }),
    prisma.guest.upsert({
      where: { invitationCode: 'BS-3M45' },
      update: {},
      create: {
        publicId: 'guest-2',
        eventId: event.id,
        name: 'Carlos López',
        phone: '+573007654321',
        email: 'carlos@example.com',
        invitationCode: 'BS-3M45',
        attendanceStatus: 'PENDING',
      },
    }),
    prisma.guest.upsert({
      where: { invitationCode: 'BS-9N81' },
      update: {},
      create: {
        publicId: 'guest-3',
        eventId: event.id,
        name: 'Ana Martínez',
        phone: '+573009876543',
        email: 'ana@example.com',
        invitationCode: 'BS-9N81',
        attendanceStatus: 'PENDING',
      },
    }),
  ]);
  console.log(`✅ Created ${guests.length} guests`);

  // Crear regalos de ejemplo
  const gifts = await Promise.all([
    prisma.gift.upsert({
      where: { publicId: 'gift-1' },
      update: {},
      create: {
        publicId: 'gift-1',
        eventId: event.id,
        name: 'Set de ropa 0-3 meses',
        description: 'Ropita cómoda para los primeros días del bebé.',
        category: 'ropa',
        isActive: true,
        isReserved: false,
      },
    }),
    prisma.gift.upsert({
      where: { publicId: 'gift-2' },
      update: {},
      create: {
        publicId: 'gift-2',
        eventId: event.id,
        name: 'Chupete premium',
        description: 'Chupete ortodóntico de silicona suave.',
        category: 'accesorios',
        isActive: true,
        isReserved: false,
      },
    }),
    prisma.gift.upsert({
      where: { publicId: 'gift-3' },
      update: {},
      create: {
        publicId: 'gift-3',
        eventId: event.id,
        name: 'Manta de algodón',
        description: 'Manta suave y abrigadora para el bebé.',
        category: 'accesorios',
        isActive: true,
        isReserved: false,
      },
    }),
    prisma.gift.upsert({
      where: { publicId: 'gift-4' },
      update: {},
      create: {
        publicId: 'gift-4',
        eventId: event.id,
        name: 'Juguete de peluche',
        description: 'Peluche suave y seguro para recién nacidos.',
        category: 'juguetes',
        isActive: true,
        isReserved: false,
      },
    }),
  ]);
  console.log(`✅ Created ${gifts.length} gifts`);

  // Crear recuerdos de ejemplo
  const memories = await Promise.all([
    prisma.memory.upsert({
      where: { publicId: 'memory-1' },
      update: {},
      create: {
        publicId: 'memory-1',
        eventId: event.id,
        title: 'El día que supimos la noticia',
        description: 'Un momento inolvidable que cambió nuestras vidas.',
        mediaUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800',
        mediaType: 'IMAGE',
        eventDate: new Date('2024-03-15'),
        sortOrder: 1,
        isPublished: true,
      },
    }),
    prisma.memory.upsert({
      where: { publicId: 'memory-2' },
      update: {},
      create: {
        publicId: 'memory-2',
        eventId: event.id,
        title: 'La primera ecografía',
        description: 'Ver a nuestro bebé por primera vez fue mágico.',
        mediaUrl: 'https://images.unsplash.com/photo-1555252333-9f8e92e65dfb?w=800',
        mediaType: 'IMAGE',
        eventDate: new Date('2024-04-20'),
        sortOrder: 2,
        isPublished: true,
      },
    }),
  ]);
  console.log(`✅ Created ${memories.length} memories`);

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
