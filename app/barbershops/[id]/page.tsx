import { Button } from "@/app/_components/ui/button"
import { db } from "@/app/_lib/prisma"
import { ChevronLeftIcon, MapPinIcon, MenuIcon, StarIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

interface BarbershopPageProps {
  params: {
    id: string
  }
}

const BarbershopPage = async ({ params }: BarbershopPageProps) => {
  //chamar meu banco de dados
  const barbershop = await db.barbershop.findUnique({
    where: {
      id: params.id,
    },
  })

  if (!barbershop) {
    return notFound()
  }
  return (
    <div>
      {/* IMAGEM */}
      <div className="relative h-[250px] w-full">
        <Image
          src={barbershop?.imageUrl}
          fill
          alt={barbershop?.name}
          className="object-cover"
        />

        <Button
          size="icon"
          variant="secondary"
          className="absolute left-5 top-5"
          asChild
        >
          <Link href="/">
            <ChevronLeftIcon />
          </Link>
        </Button>

        <Button
          size="icon"
          variant="secondary"
          className="absolute right-5 top-5"
        >
          <MenuIcon />
        </Button>
      </div>

      {/* TEXTO */}
      <div className="border-b border-solid p-5">
        <h1 className="mb-3 text-xl font-bold">{barbershop?.name}</h1>
        <div className="mb-2 flex items-center gap-1">
          <MapPinIcon size={18} className="text-primary" />
          <p className="text-sm text-gray-400">{barbershop?.address}</p>
        </div>

        <div className="flex items-center gap-1">
          <StarIcon size={18} className="fill-primary text-primary" />
          <p className="text-sm text-gray-400">5,0 (499 avaliações)</p>
        </div>
      </div>

      {/* DESCRIÇÃO */}
      <div className="space-y-2 border-b border-solid p-5">
        <h2 className="text-xs font-bold uppercase text-gray-400">Sobre nós</h2>
        <p className="text-justify text-sm">{barbershop?.description}</p>
      </div>
    </div>
  )
}

export default BarbershopPage
