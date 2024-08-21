import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  // Create an admin
  const admin = await prisma.admin.create({
    data: {
      name: "admin",
      address: "1231231232",
    },
  });

  // Create 2 customers
  const customers = [];
  const customer_one = await prisma.customer.create({
    data: {
      name: "Suvan Sarkar",
      customerId: "CUST123",
      contact: "7979797979",
      dlImage: "path/to/dl/image.jpg", // Replace with actual path
    },
  });
  customers.push(customer_one);

  const customer_two = await prisma.customer.create({
    data: {
      name: "dummy",
      customerId: "dummy123",
      contact: "1234567890",
      dlImage: "path/to/dl/image.jpg", // Replace with actual path
    },
  });
  customers.push(customer_two);

  const discount = await prisma.discount.create({
    data: {
      discountId: "123123",
      discount: 10,
    },
  });
  const cars = [];
  const carModels = [
    "Toyota Camry",
    "Honda Accord",
    "Ford Mustang",
    "Chevrolet Corvette",
    "Tesla Model S",
    "BMW 3 Series",
    "Audi A4",
    "Mercedes-Benz C-Class",
    "Nissan Altima",
    "Volkswagen Passat",
  ];

  for (let i = 1; i <= 10; i++) {
    const randomIndex = Math.floor(Math.random() * carModels.length);
    const carModel = carModels[randomIndex];
    const year = Number(faker.number.int({ min: 2018, max: 2023 }));

    const car = await prisma.car.create({
      data: {
        MMY: `${carModel} ${year}`,
        licenceNumber: `${faker.string.alphanumeric({
          length: 2,
          casing: "upper",
        })}-${faker.string.alphanumeric({
          length: 2,
          casing: "upper",
        })}-${faker.string.alphanumeric({
          length: 1,
          casing: "upper",
        })}-${faker.number.int({ min: 1000, max: 9999 })}`,
        rentRate: Number(faker.number.int({ min: 2000, max: 5000 })),
        fuelType: faker.helpers.arrayElement(["Petrol", "Diesel", "Electric"]),
        rating: Number(faker.number.float({ min: 1, max: 5 })),
        location: `${faker.location.latitude({
          min: 8,
          max: 38,
        })}, ${faker.location.longitude({ min: 60, max: 99 })}`, // Replace with actual location data if needed
      },
    });
    cars.push(car);
  }

  console.log({ admin, customers, cars });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
