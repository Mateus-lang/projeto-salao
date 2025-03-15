import { db } from "@/app/_lib/prisma"
import { stripe } from "@/app/_lib/stripe"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import Stripe from "stripe"

//Esta rota precisa estar excluída do CSRF
export async function POST(request: Request) {
  const body = await request.text()
  const signature = (await headers()).get("Stripe-Signature") as string

  let event: Stripe.Event

  try {
    //Verificar a assinatura do webhook
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(`Webhook error: ${error.message}`)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  //Processar diferentes tipos de eventos
  const session = event.data.object as Stripe.Checkout.Session

  //Quando o pagamento é bem sucedido
  if (event.type === "checkout.session.completed") {
    //Obter ID do agendamento dos metadados
    const bookingId = session.metadata?.bookingId

    if (!bookingId) {
      return NextResponse.json(
        { error: "ID do agendamento não encontrado" },
        { status: 400 },
      )
    }

    //Atualizar o status do pagamento
    await db.payment.update({
      where: {
        bookingId: bookingId,
      },
      data: {
        status: "completed",
      },
    })

    //TODO: Atualizar o status do agendamento para indicar que o pagamento foi realizado
  }

  return NextResponse.json({ received: true })
}

//Configurar como não processará o corpo do request como JSON
export const config = {
  api: {
    bodyParser: false,
  },
}
