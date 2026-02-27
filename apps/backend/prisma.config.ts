/* eslint-disable */
import path from 'node:path'
import { defineConfig } from 'prisma/config'
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  migrate: {
    async adapter() {
      return new PrismaPg({ connectionString: process.env.DATABASE_URL as string })
    },
  },
  datasource: {
    url: process.env.DATABASE_URL as string,
  },
})
