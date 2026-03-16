## Project Set up

1. Create a new project

```bash
mkdir <name-directory>
cd <name-directory>
```

Initialize a TypeScript project:

```bash
npm init -y
npm install typescript tsx @types/node --save-dev
npx tsc --init
```

2. Install required dependencies

```bash
npm install prisma @types/pg --save-dev
npm install @prisma/client @prisma/adapter-pg pg dotenv
```

3. Configure ESM support

Update tsconfig.json
```json
{
  "compilerOptions": {
    "module": "esnext",
    "moduleResolution": "bundler",
    "target": "es2023",
  }
}
```

Update package.json
```json
{
  "type": "module"
}
```

4. Initialize Prisma ORM and create a Prisma Postgres Database

Set up your Prisma ORM project by creating your Prisma Schema file with the following command:
```bash
npx prisma init --db --output ../generated/prisma
```

The generated prisma.config.ts file looks like this:
```bash
import "dotenv/config"
import { defineConfig, env } from "prisma/config"

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
})
```

The generated schema uses the ESM-first prisma-client generator with a custom output path:
```bash
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
}
```

5. Define your data model

Open prisma/schema.prisma and add the following models:
```bash
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model User { 
  id    Int     @id @default(autoincrement()) 
  email String  @unique
  name  String?
  posts Post[]
} 

model Post { 
  id        Int     @id @default(autoincrement()) 
  title     String
  content   String?
  published Boolean @default(false) 
  author    User    @relation(fields: [authorId], references: [id]) 
  authorId  Int
} 
```

6. Create and apply your first migration

Create your first migration to set up the database tables:
```bash
npx prisma migrate dev --name init
```

Now run the following command to generate the Prisma Client:
```bash
npx prisma generate
```

7. Instantiate Prisma Client

Now that you have all the dependencies installed, you can instantiate Prisma Client. You need to pass an instance of the Prisma ORM driver adapter adapter to the PrismaClient constructor:
```bash
import "dotenv/config"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../generated/prisma/client"

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

export { prisma }
```

8. Explore your data with Prisma Studio

```bash
npx prisma studio
```