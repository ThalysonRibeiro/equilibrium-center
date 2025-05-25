Para desenvolvimento:
docker compose --profile dev up

Para produção:
docker compose --profile prod up --build


Perfeito! A Vercel funciona muito bem com Neon. Aqui está o setup completo:
🚀 Configuração para Vercel + Neon:
1. Configurar o Neon:

Acesse neon.tech e crie um projeto
Copie as connection strings:

Connection string (para queries)
Pooled connection (para migrations)



2. Configuração do Prisma para Vercel:
prisma// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["jsonProtocol"]
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
3. Scripts do package.json:
json{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "postinstall": "prisma generate",
    "db:migrate": "prisma migrate deploy",
    "db:push": "prisma db push",
    "db:studio": "prisma studio"
  }
}
4. Configuração do Prisma Client:
javascript// lib/prisma.js
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
5. Variáveis de ambiente na Vercel:
Via Dashboard:

Acesse seu projeto na Vercel
Vá em Settings → Environment Variables
Adicione:

bash# Production
DATABASE_URL=postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
DIRECT_URL=postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require

# Preview (opcional - mesmo valor)
DATABASE_URL=postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
DIRECT_URL=postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
Via CLI:
bash# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Adicionar variáveis
vercel env add DATABASE_URL
vercel env add DIRECT_URL
6. Build Commands na Vercel:
json// vercel.json
{
  "buildCommand": "prisma generate && prisma migrate deploy && next build",
  "installCommand": "npm install",
  "framework": "nextjs"
}
7. Exemplo de API Route:
javascript// pages/api/users.js ou app/api/users/route.js
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const users = await prisma.user.findMany()
    return Response.json(users)
  } catch (error) {
    console.error('Database error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
🔧 Deploy Steps:
1. Preparar o projeto:
bash# Gerar Prisma Client localmente
npx prisma generate

# Testar build local
npm run build
2. Deploy via Git:
bash# Conectar repositório ao Vercel
git add .
git commit -m "Configure for Vercel + Neon"
git push origin main
3. Ou deploy direto:
bashvercel --prod
4. Executar migrations:
bash# Via Vercel CLI (após deploy)
vercel env pull .env.local
npx prisma migrate deploy

# Ou criar um script de deploy
npm run db:migrate
⚡ Otimizações importantes:
1. Edge Runtime (opcional):
javascript// app/api/users/route.js
export const runtime = 'edge'

import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
}).$extends(withAccelerate())
2. Connection pooling:
O Neon já gerencia isso automaticamente, mas você pode otimizar:
javascript// lib/prisma.js
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})
🚨 Checklist final:

✅ Neon database criado
✅ Connection strings copiadas
✅ Variáveis configuradas na Vercel
✅ prisma/schema.prisma com directUrl
✅ prisma generate no build command
✅ Migrations executadas
✅ SSL habilitado (?sslmode=require)

🔍 Debug comum:
bash# Testar conexão local
npx prisma db pull

# Ver logs da Vercel
vercel logs

# Executar migrations
vercel env pull .env.local
npx prisma migrate deploy
A combinação Vercel + Neon é excelente para aplicações Next.js! O Neon cuida do scaling do banco e a Vercel do frontend. Alguma dúvida específica sobre essa configuração?