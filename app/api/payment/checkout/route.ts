import { authOptions } from "@/app/_lib/auth"
import { db } from "@/app/_lib/prisma"
import { stripe } from "@/app/_lib/stripe"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    //verifica se o usuário está autenticado
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    //Obtem dados do request
    const { bookingId, servicePrice, serviceName } = await request.json()

    //Verifica se o agendamento existe e pertence ao usuário atual
    const booking = await db.booking.findUnique({
      where: {
        id: bookingId,

        // @ts-expect-error: session.user.id é um número, mas o TypeScript entende de forma diferente
        userId: session.user.id,
      },
      include: {
        service: {
          include: {
            barbershop: true,
          },
        },
      },
    })

    if (!booking) {
      return NextResponse.json(
        { error: "Agendamento não encontrado" },
        { status: 404 },
      )
    }

    //Verifica se o pagamento ja existe
    const existingPayment = await db.payment.findUnique({
      where: {
        bookingId,
      },
    })

    //Se já existe um pagamento completo, redireciona para a página de sucesso
    if (existingPayment && existingPayment.status === "completed") {
      return NextResponse.json({
        checkoutUrl: `/booking/${bookingId}/success`,
      })
    }

    //Calcular o preço em centavos (A Stripe só trabalha com centavos)
    const priceInCents = Math.round(servicePrice * 100)

    // Cria uma sessão de checkout na Stripe
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: serviceName,
              description: `Agendamento na barbearia ${booking.service.barbershop.name}`,
            },
            unit_amount: priceInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/bookings?success=true&bookingId=${bookingId}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/bookings?canceled=true`,
      metadata: {
        bookingId: bookingId,
      },
    })

    // Criar ou atualizar registro de pagamento
    await db.payment.upsert({
      where: { bookingId: bookingId },
      update: {
        amount: priceInCents,
        status: "pending",
        stripePaymentId: checkoutSession.id,
      },
      create: {
        bookingId: bookingId,
        amount: priceInCents,
        status: "pending",
        stripePaymentId: checkoutSession.id,
      },
    })

    // Retorna URL de checkout para o frontend
    return NextResponse.json({ checkoutUrl: checkoutSession.url })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Erro ao processar pagamento" },
      { status: 500 },
    )
  }
}
