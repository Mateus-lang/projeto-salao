"use server"

import { revalidatePath } from "next/cache"
import { db } from "../_lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"

interface CreateBookingParams {
  serviceId: string
  date: Date
}

export async function createBooking({ serviceId, date }: CreateBookingParams) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    throw new Error("Usuário não autenticado ou sem email")
  }

  // Buscar o usuário pelo email para obter o ID
  const user = await db.user.findUnique({
    where: {
      email: session.user.email,
    },
  })

  if (!user) {
    throw new Error("Usuário não encontrado")
  }

  await db.booking.create({
    data: {
      serviceId,
      date,
      userId: user.id, // Usar o ID do usuário
      status: "PAYMENT_CONFIRMED",
    },
  })
  revalidatePath("/barbershops/[id]")
  revalidatePath("/bookings")
}
