import {PrismaClient} from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config()

const prisma = new PrismaClient();

const seed = async () => {
  const hashPassword = await bcrypt.hash(process.env.SEED_USER_PASSWORD as string, 10)
  const user = await prisma.user.upsert({
    where: { email: 'timothyemail805@gmail.com' },
    update: {},
    create: {
      displayName: "Timothy",
      email: "timothyemail805@gmail.com",
      password: hashPassword
    },
  })

  const digitalLegacy = await prisma.category.upsert({
    where: { title: "Digital legacy" },
    update: {},
    create: {
      title: "Digital legacy",
      iconName: "devices",
      itemOrder: 5,
      description:"Manage online accounts, social media, and digital assets."
    },
  })

  await prisma.category.upsert({
    where: { title: "Funeral and memorial" },
    update: {},
    create: {
      title: "Funeral and memorial",
      iconName: "church",
      itemOrder: 1,
      description:"Plan and manage funeral or memorial services."
    },
  })

  await prisma.category.upsert({
    where: { title: "Legal and financial" },
    update: {},
    create: {
      title: "Legal and financial",
      iconName: "account-balance",
      itemOrder: 3,
      description:"Address wills, estates, insurance, and financial assets."
    },
  })
  
  await prisma.category.upsert({
    where: {title: "Notifications and contacts"},
    update: {},
    create: {
      title: "Notifications and contacts",
      iconName: "contact-mail",
      itemOrder: 2,
      description: "Notify organizations and manage accounts."
    }
  })

  await prisma.category.upsert({
    where: {title:"Personal well being"},
    update:{},
    create:{
      title: "Personal well being",
      iconName: "spa",
      itemOrder: 4,
      description: "Resources for grief support and self-care."
    }
  })

  await prisma.category.upsert({
    where: {title:"New partnership"},
    update:{},
    create:{
      title: "New partnership",
      iconName: "spa",
      itemOrder: 6
    }
  })

  await prisma.category.upsert({
    where: {title:"Family death"},
    update:{},
    create:{
      title: "Family death",
      iconName: "insert-drive-file",
      itemOrder: 7,
      description: "Issues related to family death"
    }
  })

  const checklistExist = await prisma.checklist.findFirst({where: {
    title: "Create a list of online accounts"
  }})
  let checklist
  if (!checklistExist) {
    checklist = await prisma.checklist.create({ // use create because itemOrder can be duplicated
      data: {
        title: "Create a list of online accounts",
        categoryId: digitalLegacy.id,
        itemOrder: 1,
        userId: user.id
      }
    })
  }

  await prisma.serviceProvider.upsert({
    where: {name: "service provider"},
    update: {},
    create: {
      name: "service provider",
      categories: [digitalLegacy.id],
      description: "description",
      latitude: 23.8,
      longitude: 129.3,
      servicesOffered: ["account checking", "accounting", "assets protection"],
      operationHours: {
        "Mon": "09:00 - 17:00",
        "Tue": "09:00 - 17:00",
        "Wed": "09:00 - 17:00",
        "Thu": "09:00 - 17:00",
        "Fri": "09:00 - 17:00",
        "Sat": "off",
        "Sun": "off"
      }
    }
  })

  console.log({ user, digitalLegacy, checklist })
}

seed();