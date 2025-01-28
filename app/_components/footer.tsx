import { Card, CardContent } from "./ui/card"

const Footer = () => {
  return (
    <footer>
      <Card>
        <CardContent className="px-5 py-6">
          <p className="text-sm text-gray-400">
            © <span className="font-bold">Barber Shop</span> | 2025
          </p>
        </CardContent>
      </Card>
    </footer>
  )
}

export default Footer
