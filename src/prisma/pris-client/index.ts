import { PrismaClient as Prisma } from "@prisma/client";

//omit sensitive fields globally
const prismaClient = new Prisma({
    omit:{
        user:{
            password:false,
            pin:false
        }
    }
});

export default prismaClient;