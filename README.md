# Equilibrium Center

Um projeto Next.js moderno configurado para deploy com Vercel e banco de dados Neon PostgreSQL, utilizando Prisma ORM e Docker para desenvolvimento.

## 🚀 Tecnologias

- **Frontend**: Next.js
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Deployment**: Vercel
- **Containerização**: Docker
- **Styling**: CSS Modules / Tailwind CSS

## 📋 Pré-requisitos

- Node.js 18+ 
- Docker e Docker Compose
- Conta no [Neon](https://neon.tech)
- Conta na [Vercel](https://vercel.com)

## 🛠️ Instalação e Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/ThalysonRibeiro/equilibrium-center.git
cd equilibrium-center
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local`:

```env
# Database
DATABASE_URL="postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Next.js
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Configure o Prisma

```bash
# Gerar o Prisma Client
npx prisma generate

# Executar migrations
npx prisma migrate deploy

# (Opcional) Visualizar dados
npx prisma studio
```

## 🐳 Desenvolvimento com Docker

### Modo Desenvolvimento

```bash
docker compose --profile dev up
```

### Modo Produção

```bash
docker compose --profile prod up --build
```

## 📁 Estrutura do Projeto

```
equilibrium-center/
├── app/                    # App Router (Next.js 13+)
│   ├── api/               # API Routes
│   ├── components/        # Componentes globais
│   └── (pages)/          # Páginas da aplicação
├── prisma/
│   ├── schema.prisma     # Schema do banco
│   └── migrations/       # Migrations
├── lib/
│   └── prisma.js         # Cliente Prisma
├── public/               # Arquivos estáticos
├── docker-compose.yml    # Configuração Docker
└── package.json
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar aplicação
npm start

# Prisma
npm run db:migrate      # Deploy migrations
npm run db:push         # Push schema changes
npm run db:studio       # Abrir Prisma Studio

# Docker
npm run docker:dev      # Docker desenvolvimento
npm run docker:prod     # Docker produção
```

## 🚀 Deploy na Vercel

### 1. Configuração do Banco Neon

1. Acesse [neon.tech](https://neon.tech) e crie um projeto
2. Copie as connection strings:
   - Connection string (para queries)
   - Pooled connection (para migrations)

### 2. Configurar Variáveis na Vercel

Via Dashboard:
- Acesse seu projeto na Vercel
- Vá em **Settings → Environment Variables**
- Adicione as variáveis de ambiente

Via CLI:
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login e configurar
vercel login
vercel env add DATABASE_URL
vercel env add DIRECT_URL
```

### 3. Deploy

```bash
# Deploy automático via Git
git add .
git commit -m "Deploy to Vercel"
git push origin main

# Ou deploy direto
vercel --prod
```

## 📊 Configuração do Banco

### Schema Prisma

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["jsonProtocol"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

### Cliente Prisma

```javascript
// lib/prisma.js
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

## 🔍 Exemplo de API Route

```javascript
// app/api/users/route.js
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const users = await prisma.user.findMany()
    return Response.json(users)
  } catch (error) {
    console.error('Database error:', error)
    return Response.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
```

## 🛠️ Troubleshooting

### Problemas Comuns

1. **Erro de conexão com banco**:
   ```bash
   npx prisma db pull
   ```

2. **Problemas no deploy**:
   ```bash
   vercel logs
   ```

3. **Migrations em produção**:
   ```bash
   vercel env pull .env.local
   npx prisma migrate deploy
   ```

## 📝 Checklist de Deploy

- [ ] Banco Neon configurado
- [ ] Connection strings copiadas
- [ ] Variáveis configuradas na Vercel
- [ ] `prisma/schema.prisma` com `directUrl`
- [ ] `prisma generate` no build command
- [ ] Migrations executadas
- [ ] SSL habilitado (`?sslmode=require`)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Thalyson Ribeiro**

- GitHub: [@ThalysonRibeiro](https://github.com/ThalysonRibeiro)

---

⭐ Se este projeto te ajudou, considere dar uma estrela!
