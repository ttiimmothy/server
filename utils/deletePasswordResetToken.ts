import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient

export const deletePasswordResetToken = async () => {
  await prisma.passwordResetToken.deleteMany({
    where: {
      expiresAt: { lt: new Date() }
    }
  })
}