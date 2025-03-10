"use client"

import { useState } from "react"
import { Button } from "./ui/button"

interface CheckoutButtonProps {
  bookingId: string
  servicePrice: number
  serviceName: string
}

const CheckoutButton = ({
  bookingId,
  servicePrice,
  serviceName,
}: CheckoutButtonProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = async () => {
    try {
      setIsLoading(true)

      //chamada para a API que criará uma sessão de checkout no stripe
      const response = await fetch("/api/payment/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId,
          servicePrice,
          serviceName,
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao processar o pagamento")
      }

      const { checkoutUrl } = await response.json()

      //redireciona o usuário para a URL de checkout do stripe
      window.location.href = checkoutUrl
    } catch (error) {
      console.error(error)
      alert("Erro ao processar o pagamento. Por favor, tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleCheckout}
      disabled={isLoading}
      className="mt-3 w-full"
    >
      {isLoading ? "Processando..." : "Pagar Agora"}
    </Button>
  )
}

export default CheckoutButton
