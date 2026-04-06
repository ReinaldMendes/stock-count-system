import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clean up
  await prisma.stockCountItem.deleteMany();
  await prisma.stockCount.deleteMany();
  await prisma.productStock.deleteMany();
  await prisma.product.deleteMany();
  await prisma.employee.deleteMany();

  // Employees
  const defaultPassword = await bcrypt.hash("password123", 10);
  
  const employees = await Promise.all([
    prisma.employee.create({ 
      data: { 
        name: "João Silva", 
        email: "joao@example.com",
        password: defaultPassword,
        role: "admin"
      } 
    }),
    prisma.employee.create({ 
      data: { 
        name: "Maria Souza", 
        email: "maria@example.com",
        password: defaultPassword,
        role: "user"
      } 
    }),
    prisma.employee.create({ 
      data: { 
        name: "Carlos Santos", 
        email: "carlos@example.com",
        password: defaultPassword,
        role: "user"
      } 
    }),
    prisma.employee.create({ 
      data: { 
        name: "Ana Costa", 
        email: "ana@example.com",
        password: defaultPassword,
        role: "user"
      } 
    }),
  ]);

  // Products
  const products = await Promise.all([
    prisma.product.create({ data: { code: "PROD-001", name: "Notebook Dell Inspiron 15", unit: "UN" } }),
    prisma.product.create({ data: { code: "PROD-002", name: "Mouse Logitech MX Master 3", unit: "UN" } }),
    prisma.product.create({ data: { code: "PROD-003", name: "Teclado Mecânico Keychron K2", unit: "UN" } }),
    prisma.product.create({ data: { code: "PROD-004", name: "Monitor LG UltraWide 29\"", unit: "UN" } }),
    prisma.product.create({ data: { code: "PROD-005", name: "Webcam Logitech C920", unit: "UN" } }),
    prisma.product.create({ data: { code: "PROD-006", name: "Headset HyperX Cloud II", unit: "UN" } }),
    prisma.product.create({ data: { code: "PROD-007", name: "SSD Samsung 1TB", unit: "UN" } }),
    prisma.product.create({ data: { code: "PROD-008", name: "Memória RAM DDR4 16GB", unit: "UN" } }),
    prisma.product.create({ data: { code: "PROD-009", name: "Hub USB-C 7 portas", unit: "UN" } }),
    prisma.product.create({ data: { code: "PROD-010", name: "Suporte para Notebook", unit: "UN" } }),
  ]);

  // Product stocks
  const systemQtys = [25, 50, 30, 15, 40, 35, 60, 80, 45, 100];
  await Promise.all(
    products.map((p, i) =>
      prisma.productStock.create({
        data: { productId: p.id, quantity: systemQtys[i] },
      })
    )
  );

  // Stock count 1 — EM_ANDAMENTO (código 1071)
  const sc1 = await prisma.stockCount.create({
    data: {
      code: "1071",
      scheduledAt: new Date("2025-11-20T08:00:00Z"),
      status: "EM_ANDAMENTO",
      employeeId: employees[0].id,
    },
  });

  await Promise.all([
    // Items a conferir
    prisma.stockCountItem.create({
      data: {
        stockCountId: sc1.id,
        productId: products[0].id,
        systemQuantity: 25,
        status: "A_CONFERIR",
      },
    }),
    prisma.stockCountItem.create({
      data: {
        stockCountId: sc1.id,
        productId: products[1].id,
        systemQuantity: 50,
        status: "A_CONFERIR",
      },
    }),
    prisma.stockCountItem.create({
      data: {
        stockCountId: sc1.id,
        productId: products[2].id,
        systemQuantity: 30,
        status: "A_CONFERIR",
      },
    }),
    // Items conferidos
    prisma.stockCountItem.create({
      data: {
        stockCountId: sc1.id,
        productId: products[3].id,
        systemQuantity: 15,
        countedQuantity: 15,
        status: "CONFERIDO",
      },
    }),
    prisma.stockCountItem.create({
      data: {
        stockCountId: sc1.id,
        productId: products[4].id,
        systemQuantity: 40,
        countedQuantity: 40,
        status: "CONFERIDO",
      },
    }),
    // Items faltantes/excedentes
    prisma.stockCountItem.create({
      data: {
        stockCountId: sc1.id,
        productId: products[5].id,
        systemQuantity: 35,
        countedQuantity: 32,
        status: "FALTANTE_EXCEDENTE",
        observacao: "3 unidades danificadas encontradas no estoque",
      },
    }),
    prisma.stockCountItem.create({
      data: {
        stockCountId: sc1.id,
        productId: products[6].id,
        systemQuantity: 60,
        countedQuantity: 65,
        status: "FALTANTE_EXCEDENTE",
        observacao: "Entrada não registrada no sistema - produtos recebidos mas não lançados",
      },
    }),
  ]);

  // Stock count 2 — FINALIZADA (código 1072)
  const sc2 = await prisma.stockCount.create({
    data: {
      code: "1072",
      scheduledAt: new Date("2025-11-18T09:00:00Z"),
      status: "FINALIZADA",
      employeeId: employees[1].id,
    },
  });

  await Promise.all([
    prisma.stockCountItem.create({
      data: {
        stockCountId: sc2.id,
        productId: products[0].id,
        systemQuantity: 25,
        countedQuantity: 25,
        status: "CONFERIDO",
      },
    }),
    prisma.stockCountItem.create({
      data: {
        stockCountId: sc2.id,
        productId: products[1].id,
        systemQuantity: 50,
        countedQuantity: 48,
        status: "FALTANTE_EXCEDENTE",
        observacao: "2 unidades vendidas mas não baixadas do estoque",
      },
    }),
    prisma.stockCountItem.create({
      data: {
        stockCountId: sc2.id,
        productId: products[7].id,
        systemQuantity: 80,
        countedQuantity: 80,
        status: "CONFERIDO",
      },
    }),
    prisma.stockCountItem.create({
      data: {
        stockCountId: sc2.id,
        productId: products[8].id,
        systemQuantity: 45,
        countedQuantity: 45,
        status: "CONFERIDO",
      },
    }),
  ]);

  // Stock count 3 — EM_ANDAMENTO (código 1073)
  const sc3 = await prisma.stockCount.create({
    data: {
      code: "1073",
      scheduledAt: new Date("2025-11-25T10:00:00Z"),
      status: "EM_ANDAMENTO",
      employeeId: employees[2].id,
    },
  });

  await Promise.all([
    prisma.stockCountItem.create({
      data: {
        stockCountId: sc3.id,
        productId: products[2].id,
        systemQuantity: 30,
        countedQuantity: 30,
        status: "CONFERIDO",
      },
    }),
    prisma.stockCountItem.create({
      data: {
        stockCountId: sc3.id,
        productId: products[3].id,
        systemQuantity: 15,
        status: "A_CONFERIR",
      },
    }),
    prisma.stockCountItem.create({
      data: {
        stockCountId: sc3.id,
        productId: products[4].id,
        systemQuantity: 40,
        status: "A_CONFERIR",
      },
    }),
    prisma.stockCountItem.create({
      data: {
        stockCountId: sc3.id,
        productId: products[9].id,
        systemQuantity: 100,
        countedQuantity: 98,
        status: "FALTANTE_EXCEDENTE",
        observacao: "2 unidades com defeito de fabricação",
      },
    }),
  ]);

  console.log("✅ Seed complete!");
  console.log(`   Stock counts created: 1071 (id: ${sc1.id}), 1072 (id: ${sc2.id}), 1073 (id: ${sc3.id})`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
