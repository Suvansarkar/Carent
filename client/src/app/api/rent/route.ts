import { prisma } from "@/lib/prisma";
import { transporter } from "../nodemailer/service";

export async function POST(request: Request) {
  const data = await request.json();
  const overlappingRent = await prisma.rent.findFirst({
    where: {
      carId: data.carId,
      OR: [
        {
          AND: [
            {
              startDate: {
                lte: data.startDate,
              },
            },
            {
              endDate: {
                gte: data.startDate,
              },
            },
          ],
        },
        {
          AND: [
            {
              startDate: {
                lte: data.endDate,
              },
            },
            {
              endDate: {
                gte: data.endDate,
              },
            },
          ],
        },
      ],
    },
  });

  if (overlappingRent) {
    return Response.json({
      status: 400,
      message: "This car is already booked for the selected period.",
    });
  }
  const newRent = await prisma.rent.create({ data: data });
  transporter.sendMail({
    from: process.env.EMAIL,
    to: "suvan.s22@iiits.in",
    subject: "New Rent",
    text: `New Rent: ${JSON.stringify(newRent)}`,
  });
  return Response.json({
    status: 200,
    body: newRent,
  });
}

export async function GET(request: Request) {
  const rents = await prisma.rent.findMany({
    where: {
      customerId: "66c4bb6b479fdf6f8403c372",
    },
  });
  return Response.json({
    status: 200,
    body: rents,
  });
}

export async function DELETE(request: Request) {
  const data = await request.json();
  const rent = await prisma.rent.delete({
    where: {
      id: data.id,
    },
  });
  transporter.sendMail({
    from: process.env.EMAIL,
    to: "suvan.s22@iiits.in",
    subject: "Rent Ended",
    text: `Rent Ended: ${JSON.stringify(rent)}`,
  });
  return Response.json({
    status: 200,
    body: rent,
  });
}
// Function to extend the end date of the rent after checking for overlapping rents
export async function PATCH(request: Request) {
  const data = await request.json();
  const overlappingRent = await prisma.rent.findFirst({
    where: {
      carId: data.carId,
      OR: [
        {
          AND: [
            {
              startDate: {
                lte: data.endDate,
              },
            },
            {
              endDate: {
                gte: data.endDate,
              },
            },
          ],
        },
      ],
    },
  });

  if (overlappingRent) {
    return Response.json({
      status: 400,
      message: "This car is already booked for the selected period.",
    });
  }
  console.log(data);
  const updatedRent = await prisma.rent.update({
    where: {
      id: data.id,
    },
    data: {
      endDate: data.endDate,
    },
  });
  transporter.sendMail({
    from: process.env.EMAIL,
    to: "suvan.s22@iiits.in",
    subject: "Rent Extended",
    text: `Rent Extended: ${JSON.stringify(updatedRent)}`,
  });
  return Response.json({
    status: 200,
    body: updatedRent,
  });
}
