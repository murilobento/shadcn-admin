import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function main() {
    try {
        console.log('Attempting to connect to DB...')
        const users = await prisma.user.findMany({ take: 5 })
        console.log('Successfully connected to DB.')
        console.log('Users found:', JSON.stringify(users, null, 2))
    } catch (e) {
        console.error('Error connecting to DB:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
