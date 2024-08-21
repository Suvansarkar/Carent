import { prisma } from "@/lib/prisma";

type Params = {
  carId: string;
};

export async function GET(request: Request, context: { params: Params }) {
  const { carId } = context.params;
  try {
    const car = await prisma.car.findUnique({
      where: {
        id: carId,
      },
    });
    return Response.json({
      status: 200,
      body: car,
    });
  } catch (error) {
    return Response.json({
      status: 404,
      body: {
        message: "Car not found",
      },
    });
  }
}
