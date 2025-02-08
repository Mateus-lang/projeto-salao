import Image from "next/image"
import { Button } from "./ui/button"
import { DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { signIn } from "next-auth/react"

const SignInDialog = () => {
  const handleLoginWithGoogle = () => signIn("google")

  return (
    <>
      <DialogHeader>
        <DialogTitle>Faça seu login na plataforma!</DialogTitle>
        <DialogDescription>
          Conecte-se usando sua conta Google.
        </DialogDescription>
      </DialogHeader>

      <Button
        variant="outline"
        className="gap-2"
        onClick={handleLoginWithGoogle}
      >
        <Image alt="google" src="/google.svg" width={18} height={18} />
        Google
      </Button>
    </>
  )
}

export default SignInDialog
