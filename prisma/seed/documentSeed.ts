import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient;

const document = async () => {
  const user = await prisma.user.findUnique({
    where: {
      email: "timothyemail805@gmail.com"
    }
  })

  const category = await prisma.category.findUnique({
    where: {
      name: "Funeral and memorial"
    }
  })

  const documentExist = await prisma.document.findFirst({
    where: {
      name: "seed document"
    }
  })

  if (user && category && !documentExist) {
    const documentCreate = await prisma.document.create({
      data:{
        userId: user.id,
        name: "seed document",
        categoryId: category.id,
        tags: ["tag"]
      }
    })
    console.log(documentCreate)
  }
}

document()