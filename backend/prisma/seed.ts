import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log('🌱 Starting seed...');

  // 1. BusinessConfig — singleton, create if not exists
  const businessConfig = await prisma.businessConfig.upsert({
    where: { id: 1 },
    update: {},
    create: {
      businessName: 'Leños Rellenos',
      phone: process.env.WHATSAPP_NUMBER ?? '+520000000000',
      isOpen: true,
      deliveryFee: 0,
    },
  });
  console.log(`✅ BusinessConfig: ${businessConfig.businessName}`);

  // 2. Admin user — create if not exists
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@lenosrellenos.com';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'Admin1234!';
  const adminName = process.env.ADMIN_NAME ?? 'Administrador';

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: adminName,
        role: 'ADMIN',
        isActive: true,
      },
    });
    console.log(`✅ Admin user created: ${admin.email}`);
  } else {
    console.log(`⏭️  Admin user already exists: ${existingAdmin.email}`);
  }

  // 3. Categories — upsert by name
  const categoriesData = [
    {
      name: 'Clásicos',
      description: 'Los leños rellenos de siempre, sin falla.',
    },
    { name: 'Especiales', description: 'Combinaciones únicas de temporada.' },
    {
      name: 'Bebidas',
      description: 'Refrescos y aguas para acompañar tu pedido.',
    },
  ];

  const categories: Record<string, number> = {};
  for (const cat of categoriesData) {
    const category = await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: { name: cat.name, description: cat.description, isActive: true },
    });
    categories[cat.name] = category.id;
    console.log(`✅ Category: ${category.name} (id: ${category.id})`);
  }

  // 4. Products — upsert by name
  const productsData = [
    {
      name: 'Leño Clásico',
      description: 'Tortilla de maíz rellena con frijoles, queso y salsa roja.',
      price: 35.0,
      stock: 50,
      categoryName: 'Clásicos',
    },
    {
      name: 'Leño con Chorizo',
      description:
        'Tortilla de maíz rellena con chorizo, queso Oaxaca y epazote.',
      price: 40.0,
      stock: 40,
      categoryName: 'Clásicos',
    },
    {
      name: 'Leño Especial de la Casa',
      description:
        'Combinación exclusiva del chef con ingredientes de temporada.',
      price: 55.0,
      stock: 20,
      categoryName: 'Especiales',
    },
    {
      name: 'Leño Vegetariano',
      description:
        'Relleno de verduras salteadas, queso panela y chile poblano.',
      price: 45.0,
      stock: 30,
      categoryName: 'Especiales',
    },
    {
      name: 'Agua de Jamaica',
      description: 'Agua fresca de flor de jamaica, sin azúcar añadida.',
      price: 20.0,
      stock: 60,
      categoryName: 'Bebidas',
    },
    {
      name: 'Refresco',
      description: 'Coca-Cola, Sprite o Fanta en lata 355ml.',
      price: 25.0,
      stock: 80,
      categoryName: 'Bebidas',
    },
  ];

  for (const prod of productsData) {
    const existing = await prisma.product.findFirst({
      where: { name: prod.name, categoryId: categories[prod.categoryName] },
    });
    if (!existing) {
      const product = await prisma.product.create({
        data: {
          name: prod.name,
          description: prod.description,
          price: prod.price,
          stock: prod.stock,
          available: true,
          categoryId: categories[prod.categoryName],
        },
      });
      console.log(`✅ Product: ${product.name} ($${product.price})`);
    } else {
      console.log(`⏭️  Product already exists: ${existing.name}`);
    }
  }

  console.log('\n🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
