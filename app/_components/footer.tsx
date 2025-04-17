import { Card, CardContent } from "./ui/card"
import { ThemeSwitcher } from "./theme-switcher"

const Footer = () => {
  return (
    <footer>
      <Card>
        <CardContent className="flex items-center justify-between px-5 py-6">
          <p className="text-sm text-gray-400">
            © <span className="font-bold">Anna Telles</span> | 2025
          </p>
          <ThemeSwitcher />
        </CardContent>
      </Card>
    </footer>
  )
}

export default Footer
