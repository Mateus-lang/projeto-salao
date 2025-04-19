"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createBooking } from "../_actions/create-booking"
import { toast } from "sonner"

export default function SuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isProcessing, setIsProcessing] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const sessionId = searchParams.get("session_id")

    if (!sessionId) {
      toast.error("Sessão de pagamento não encontrada")
      setErrorMessage("Sessão de pagamento não encontrada")
      setIsProcessing(false)
      return
    }

    async function confirmBooking() {
      try {
        console.log("Verificando sessão:", sessionId)
        // Verificar o status do pagamento e obter metadados
        const response = await fetch(
          `/api/stripe/confirm?session_id=${sessionId}`,
        )

        if (!response.ok) {
          const errorData = await response.json()
          console.error("Erro na resposta da API:", errorData)
          throw new Error(errorData.error || "Falha ao confirmar pagamento")
        }

        const data = await response.json()
        console.log("Dados da resposta:", data)

        if (!data.success) {
          throw new Error(data.message || "Pagamento não confirmado")
        }

        if (!data.serviceId || !data.date) {
          throw new Error("Dados da reserva incompletos")
        }

        console.log("Criando reserva com:", {
          serviceId: data.serviceId,
          date: new Date(data.date),
        })

        // Criar a reserva após confirmação do pagamento
        await createBooking({
          serviceId: data.serviceId,
          date: new Date(data.date),
        })

        toast.success("Reserva confirmada com sucesso!")

        // Redirecionar para página inicial
        setTimeout(() => {
          router.push("/")
        }, 2000)
      } catch (error) {
        console.error("Erro ao confirmar reserva:", error)
        const errorMsg =
          error instanceof Error ? error.message : "Erro desconhecido"
        setErrorMessage(errorMsg)
        toast.error(`Erro ao confirmar reserva: ${errorMsg}`)
      } finally {
        setIsProcessing(false)
      }
    }

    confirmBooking()
  }, [searchParams, router])

  return (
    <div className="container flex min-h-[70vh] flex-col items-center justify-center py-10">
      <h1 className="mb-4 text-2xl font-bold">Processando seu pagamento</h1>

      {isProcessing ? (
        <p>Estamos confirmando sua reserva, aguarde um momento...</p>
      ) : errorMessage ? (
        <div className="text-center">
          <p className="mb-4 text-red-500">{errorMessage}</p>
          <button
            className="rounded bg-blue-500 px-4 py-2 text-white"
            onClick={() => router.push("/")}
          >
            Voltar para a página inicial
          </button>
        </div>
      ) : (
        <p>Redirecionando para a página inicial...</p>
      )}
    </div>
  )
}
