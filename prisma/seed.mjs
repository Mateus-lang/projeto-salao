import { execSync } from "child_process"

try {
  console.log("Executando seed...")
  execSync("npx ts-node --project tsconfig-seed.json prisma/seed.ts", {
    stdio: "inherit",
  })
} catch (error) {
  console.error("Erro ao executar seed:", error)
  process.exit(1)
}
