"use client"

import { Suspense } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/app/_components/ui/button"

function CancelContent() {
  const router = useRouter()

  return (
    <div className="container flex min-h-[70vh] flex-col items-center justify-center py-10">
      <h1 className="mb-4 text-2xl font-bold">Pagamento cancelado</h1>
      <p className="mb-6">
        Seu pagamento foi cancelado e nenhuma reserva foi confirmada.
      </p>

      <Button onClick={() => router.push("/")}>
        Voltar para a página inicial
      </Button>
    </div>
  )
}

function CancelLoading() {
  return (
    <div className="container flex min-h-[70vh] flex-col items-center justify-center py-10">
      <h1 className="mb-4 text-2xl font-bold">Carregando...</h1>
    </div>
  )
}

export default function CancelPage() {
  return (
    <Suspense fallback={<CancelLoading />}>
      <CancelContent />
    </Suspense>
  )
}
