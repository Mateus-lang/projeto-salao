import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { service, selectedDate } = data

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe não configurado" },
        { status: 500 },
      )
    }

    const origin = request.headers.get("origin") || "http://localhost:3000"

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-02-24.acacia",
    })

    // Na criação da sessão, verifique se os dados estão completos
    if (!service.id || !selectedDate) {
      return NextResponse.json(
        { error: "Dados da reserva incompletos" },
        { status: 400 },
      )
    }

    console.log("Criando sessão com metadados:", {
      serviceId: service.id,
      date: selectedDate,
    })

    // Criar sessão com metadados da reserva
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
      metadata: {
        serviceId: service.id,
        date: selectedDate,
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error("API: Erro ao criar sessão:", error)
    return NextResponse.json(
      { error: "Falha ao criar sessão de pagamento" },
      { status: 500 },
    )
  }
}
