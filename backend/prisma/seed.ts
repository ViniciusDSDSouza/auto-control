import { PrismaClient, NoteStatus } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...");

  console.log("🧹 Limpando dados existentes...");
  await prisma.partInNote.deleteMany();
  await prisma.note.deleteMany();
  await prisma.car.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.part.deleteMany();
  await prisma.user.deleteMany();

  console.log("👤 Criando usuários...");
  const hashedPassword = await bcrypt.hash("123456", 10);

  const users = await prisma.user.createMany({
    data: [
      {
        email: "admin@autocontrol.com",
        password: hashedPassword,
        name: "Administrador",
      },
      {
        email: "mecanico@autocontrol.com",
        password: hashedPassword,
        name: "João Mecânico",
      },
      {
        email: "atendente@autocontrol.com",
        password: hashedPassword,
        name: "Maria Atendente",
      },
    ],
  });
  console.log(`✅ ${users.count} usuários criados`);

  console.log("👥 Criando clientes...");
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: "Carlos Silva",
        email: "carlos.silva@email.com",
        phone: "(11) 98765-4321",
      },
    }),
    prisma.customer.create({
      data: {
        name: "Ana Oliveira",
        email: "ana.oliveira@email.com",
        phone: "(21) 99876-5432",
      },
    }),
    prisma.customer.create({
      data: {
        name: "Roberto Santos",
        email: "roberto.santos@email.com",
        phone: "(31) 98765-4321",
      },
    }),
    prisma.customer.create({
      data: {
        name: "Fernanda Costa",
        phone: "(41) 98765-4321",
      },
    }),
    prisma.customer.create({
      data: {
        name: "Pedro Almeida",
        email: "pedro.almeida@email.com",
        phone: "(47) 99876-5432",
      },
    }),
    prisma.customer.create({
      data: {
        name: "Juliana Ferreira",
        email: "juliana.ferreira@email.com",
        phone: "(48) 98765-4321",
      },
    }),
    prisma.customer.create({
      data: {
        name: "Marcos Pereira",
        phone: "(51) 99876-5432",
      },
    }),
    prisma.customer.create({
      data: {
        name: "Lucia Rodrigues",
        email: "lucia.rodrigues@email.com",
        phone: "(61) 98765-4321",
      },
    }),
  ]);
  console.log(`✅ ${customers.length} clientes criados`);

  console.log("🚗 Criando carros...");
  const cars: Array<{
    car: Awaited<ReturnType<typeof prisma.car.create>>;
    customer: (typeof customers)[number];
  }> = [];

  const carBrands = [
    { brand: "Volkswagen", models: ["Gol", "Polo", "Fox", "Virtus"] },
    { brand: "Fiat", models: ["Palio", "Uno", "Mobi", "Argo"] },
    { brand: "Chevrolet", models: ["Onix", "Prisma", "Cruze", "Tracker"] },
    { brand: "Ford", models: ["Ka", "Fiesta", "Focus", "Ranger"] },
    { brand: "Toyota", models: ["Corolla", "Hilux", "Yaris"] },
    { brand: "Honda", models: ["Civic", "Fit", "HR-V"] },
  ];

  const colors = ["Branco", "Preto", "Prata", "Vermelho", "Azul", "Cinza"];

  for (let i = 0; i < customers.length; i++) {
    const customer = customers[i];
    const numCars = Math.floor(Math.random() * 3) + 1;

    for (let j = 0; j < numCars; j++) {
      const brandInfo = carBrands[Math.floor(Math.random() * carBrands.length)];
      const model =
        brandInfo.models[Math.floor(Math.random() * brandInfo.models.length)];
      const year = 2015 + Math.floor(Math.random() * 10);
      const color = colors[Math.floor(Math.random() * colors.length)];
      const plate = generatePlate();

      const car = await prisma.car.create({
        data: {
          customerId: customer.id,
          brand: brandInfo.brand,
          model: model,
          year: year,
          color: color,
          plate: plate,
        },
      });
      cars.push({ car, customer });
    }
  }
  console.log(`✅ ${cars.length} carros criados`);

  console.log("🔧 Criando peças...");
  const parts = await Promise.all([
    prisma.part.create({
      data: {
        name: "Pastilha de Freio Dianteira",
        model: "Modelo Universal",
        price: 85.5,
      },
    }),
    prisma.part.create({
      data: {
        name: "Filtro de Óleo",
        model: "Modelo Universal",
        price: 25.9,
      },
    }),
    prisma.part.create({
      data: {
        name: "Filtro de Ar",
        model: "Modelo Universal",
        price: 45.0,
      },
    }),
    prisma.part.create({
      data: {
        name: "Vela de Ignição",
        model: "Modelo Universal",
        price: 15.75,
      },
    }),
    prisma.part.create({
      data: {
        name: "Correia Dentada",
        model: "Modelo Universal",
        price: 120.0,
      },
    }),
    prisma.part.create({
      data: {
        name: "Amortecedor Dianteiro",
        model: "Modelo Universal",
        price: 280.0,
      },
    }),
    prisma.part.create({
      data: {
        name: "Radiador",
        model: "Modelo Universal",
        price: 350.0,
      },
    }),
    prisma.part.create({
      data: {
        name: "Bateria 60Ah",
        model: "Modelo Universal",
        price: 450.0,
      },
    }),
    prisma.part.create({
      data: {
        name: "Pneu Aro 15",
        model: "Modelo Universal",
        price: 280.0,
      },
    }),
    prisma.part.create({
      data: {
        name: "Disco de Freio",
        model: "Modelo Universal",
        price: 150.0,
      },
    }),
    prisma.part.create({
      data: {
        name: "Óleo Motor 5W30",
        model: "4 Litros",
        price: 95.0,
      },
    }),
    prisma.part.create({
      data: {
        name: "Lâmpada Farol",
        model: "Modelo Universal",
        price: 35.0,
      },
    }),
    prisma.part.create({
      data: {
        name: "Sensor ABS",
        model: "Modelo Universal",
        price: 180.0,
      },
    }),
    prisma.part.create({
      data: {
        name: "Embreagem Completa",
        model: "Modelo Universal",
        price: 520.0,
      },
    }),
    prisma.part.create({
      data: {
        name: "Bomba de Combustível",
        model: "Modelo Universal",
        price: 380.0,
      },
    }),
  ]);
  console.log(`✅ ${parts.length} peças criadas`);

  console.log("📋 Criando notas...");
  const notes: Array<{
    note: Awaited<ReturnType<typeof prisma.note.create>>;
    partInNotes: Awaited<ReturnType<typeof prisma.partInNote.create>>[];
  }> = [];
  const statuses: NoteStatus[] = ["OPEN", "PAID", "CANCELLED"];

  for (let i = 0; i < cars.length * 2; i++) {
    const randomCarData = cars[Math.floor(Math.random() * cars.length)];
    const randomCar = randomCarData.car;
    const randomCustomer = randomCarData.customer;

    const numParts = Math.min(Math.floor(Math.random() * 4) + 1, parts.length);
    const shuffledParts = [...parts].sort(() => Math.random() - 0.5);
    const selectedParts: Array<{
      part: (typeof parts)[number];
      quantity: number;
    }> = [];
    for (let j = 0; j < numParts; j++) {
      const part = shuffledParts[j];
      const quantity = Math.floor(Math.random() * 3) + 1;
      selectedParts.push({ part, quantity });
    }

    const partsPrice = selectedParts.reduce(
      (sum, { part, quantity }) => sum + part.price * quantity,
      0
    );
    const laborPrice = Math.floor(Math.random() * 500) + 100;
    const totalPrice = partsPrice + laborPrice;

    const statusIndex = Math.random() < 0.6 ? 0 : Math.floor(Math.random() * 3);
    const status = statuses[statusIndex];

    const note = await prisma.note.create({
      data: {
        customerId: randomCustomer.id,
        carId: randomCar.id,
        laborPrice: laborPrice,
        partsPrice: partsPrice,
        totalPrice: totalPrice,
        status: status,
      },
    });

    const partInNotes = await Promise.all(
      selectedParts.map(({ part, quantity }) =>
        prisma.partInNote.create({
          data: {
            noteId: note.id,
            partId: part.id,
            quantity: quantity,
            price: part.price * quantity,
          },
        })
      )
    );

    notes.push({ note, partInNotes });
  }
  console.log(`✅ ${notes.length} notas criadas`);

  console.log("\n✨ Seed concluído com sucesso!");
  console.log(`📊 Resumo:`);
  console.log(`   - ${users.count} usuários`);
  console.log(`   - ${customers.length} clientes`);
  console.log(`   - ${cars.length} carros`);
  console.log(`   - ${parts.length} peças`);
  console.log(`   - ${notes.length} notas`);
}

function generatePlate(): string {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";

  const letter1 = letters[Math.floor(Math.random() * letters.length)];
  const letter2 = letters[Math.floor(Math.random() * letters.length)];
  const letter3 = letters[Math.floor(Math.random() * letters.length)];
  const num1 = numbers[Math.floor(Math.random() * numbers.length)];
  const num2 = numbers[Math.floor(Math.random() * numbers.length)];
  const num3 = numbers[Math.floor(Math.random() * numbers.length)];
  const num4 = numbers[Math.floor(Math.random() * numbers.length)];

  return `${letter1}${letter2}${letter3}${num1}${num2}${num3}${num4}`;
}

main()
  .catch((e) => {
    console.error("❌ Erro ao executar seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
