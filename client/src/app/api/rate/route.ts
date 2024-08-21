import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  const data = await request.json();
  const carId = data.carId;
  try {
    const updatedCar = await prisma.car.update({
      where: {
        id: carId,
      },
      data: {
        rating: (data.rating + Math.random()) % 5,
      },
    });
    return Response.json({
      status: 200,
      body: updatedCar,
    });
  } catch (error) {
    return Response.json({
      status: 400,
      body: {
        message: "Error updating car",
      },
    });
  }
}
