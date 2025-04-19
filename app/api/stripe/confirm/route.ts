import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get("session_id")

    if (!sessionId) {
      return NextResponse.json(
        { error: "ID da sessão não fornecido" },
        { status: 400 },
      )
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe não configurado" },
        { status: 500 },
      )
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-02-24.acacia",
    })

    // Verificar status da sessão
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    console.log("Sessão recuperada:", session)
    console.log("Metadados:", session.metadata)

    // Verificar se o pagamento foi concluído
    if (session.payment_status !== "paid") {
      console.log("Pagamento não confirmado:", session.payment_status)
      return NextResponse.json({
        success: false,
        message: "Pagamento não confirmado",
      })
    }

    // Se não houver metadados, reportar erro
    if (
      !session.metadata ||
      !session.metadata.serviceId ||
      !session.metadata.date
    ) {
      console.log("Metadados incompletos:", session.metadata)
      return NextResponse.json(
        { error: "Metadados da reserva não encontrados" },
        { status: 400 },
      )
    }

    // Retornar os metadados da reserva para criação
    return NextResponse.json({
      success: true,
      serviceId: session.metadata.serviceId,
      date: session.metadata.date,
    })
  } catch (error) {
    console.error("Erro ao confirmar pagamento:", error)
    return NextResponse.json(
      { error: "Falha ao verificar pagamento" },
      { status: 500 },
    )
  }
}
