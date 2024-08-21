import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const data = await request.json();
  try {
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
    } else {
      return Response.json({
        status: 200,
        body: {
          available: true,
        },
      });
    }
  } catch (error) {
    return Response.json({
      status: 404,
      body: {
        available: false,
      },
    });
  }
}
