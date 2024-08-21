import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  return Response.json({ message: "Hello, world!" });
}
