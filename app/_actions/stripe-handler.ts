"use server"

import { BarbershopService } from "@prisma/client"
import Stripe from "stripe"
import { headers } from "next/headers"

export async function createCheckoutSession(service: BarbershopService) {
  console.log("Iniciando criação do checkout para:", service.name)

  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("STRIPE_SECRET_KEY não configurada")
    return { error: "Configuração do Stripe ausente" }
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-02-24.acacia",
    })

    const headersList = await headers()
    const origin = headersList.get("origin") || "http://localhost:3000"

    console.log(
      "Criando sessão no Stripe para:",
      service.name,
      "preço:",
      service.price,
    )

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: service.name,
              images: [service.imageUrl],
            },
            unit_amount: Math.round(Number(service.price) * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
    })

    console.log("Sessão criada com sucesso, ID:", session.id)

    return { success: true, sessionId: session.id }
  } catch (error) {
    console.error("Erro ao criar sessão:", error)
    return {
      error: "Falha ao criar sessão de pagamento",
      details: error instanceof Error ? error.message : String(error),
    }
  }
}
