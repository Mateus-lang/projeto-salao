"use server"

import { BarbershopService } from "@prisma/client"
import { headers } from "next/headers"
import Stripe from "stripe"

interface CreateStripeCheckoutProps {
  bookings: BarbershopService[]
}

export const createStripeCheckout = async ({
  bookings,
}: CreateStripeCheckoutProps) => {
  // Valide os parâmetros de entrada
  if (!bookings || bookings.length === 0) {
    throw new Error("Nenhum serviço fornecido para checkout")
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY não está configurada")
  }

  try {
    const headersList = await headers()
    const origin = headersList.get("origin") ?? ""

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-02-24.acacia",
    })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "link"],
      mode: "payment",
      success_url: origin,
      cancel_url: origin,
      line_items: bookings.map((booking) => ({
        price_data: {
          currency: "brl",
          product_data: {
            name: booking.name,
            images: [booking.imageUrl],
          },
          unit_amount: Math.round(Number(booking.price) * 100),
        },
        quantity: 1,
      })),
    })

    if (!session || !session.id) {
      throw new Error("Falha ao criar sessão no Stripe")
    }

    return { sessionId: session.id }
  } catch (error) {
    console.error("Erro ao criar checkout do Stripe:", error)
    throw new Error("Falha ao processar pagamento")
  }
}
