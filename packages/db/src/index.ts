import {PrismaClient} from '@prisma/client';

// const globalForPrisma = globalThis as unknown as {
//     prisma: PrismaClient | undefined
// };


// interface GlobalPrisma {
//     prisma?: PrismaClient;
// }

// const globalForPrisma = globalThis as GlobalPrisma;
const prismaClient=new PrismaClient(); //globalForPrisma.prisma??

// if(process.env.NODE_ENV !=='production'){
//     globalForPrisma.prisma=prismaClient;
// }

export default prismaClient;

// function getPrismaClient():PrismaClient{
//     const globalForPrisma=globalThis as unknown as {
//         prisma: PrismaClient | undefined
//     }
    
//     const prismaClient=globalForPrisma.prisma??new PrismaClient();
//     if(process.env.NODE_ENV !=='production'){
//         globalForPrisma.prisma=prismaClient;
//     }

//     return prismaClient;
// }

// export{
//     getPrismaClient
// }