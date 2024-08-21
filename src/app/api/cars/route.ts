import { prisma } from "@/lib/prisma";

export async function GET() {
  const allUsers = await prisma.car.findMany();
  return Response.json({
    status: 200,
    body: allUsers,
  });
}

export async function POST(request: Request) {
  const data = await request.json();
  const newCar = await prisma.car.create({ data: data });
  return Response.json({
    status: 200,
    body: newCar,
  });
}

export async function DELETE(request: Request) {
  const data = await request.json();
  const id = data.id;
  const deletedCar = await prisma.car.delete({
    where: {
      id: id,
    },
  });

  return Response.json({
    status: 200,
    body: deletedCar,
  });
}

export async function PATCH(request: Request) {
  const data = await request.json();
  const id = data.id;
  const updatedCar = await prisma.car.update({
    where: {
      id: id,
    },
    data: {
      ...data,
    },
  });
  return Response.json({
    status: 200,
    body: updatedCar,
  });
}
