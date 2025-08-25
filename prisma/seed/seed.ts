import {PrismaClient} from "@prisma/client";
import {hash} from "bcryptjs";
import {config} from "dotenv";

config()

const prisma = new PrismaClient();

const seed = async () => {
  const hashPassword = await hash(process.env.SEED_USER_PASSWORD, 10)
  const user = await prisma.user.upsert({
    where: { email: 'timothyemail805@gmail.com' },
    update: {},
    create: {
      displayName: "Timothy",
      email: "timothyemail805@gmail.com",
      password: hashPassword
    },
  })

  await prisma.user.upsert({
    where: { email: 'ttiimmothhylsff@gmail.com' },
    update: {},
    create: {
      displayName: "Timothy",
      email: "ttiimmothhylsff@gmail.com",
      password: hashPassword,
      isDeleted: true,
      deletedAt: new Date()
    },
  })

  await prisma.user.upsert({
    where: { email: 'timothytimodanieliel@gmail.com' },
    update: {},
    create: {
      displayName: "Timothy",
      email: "timothytimodanieliel@gmail.com",
      password: await hash("000",10)
    },
  })

  const funeralAndMemorial = await prisma.category.upsert({
    where: { name: "Funeral and memorial" },
    update: {},
    create: {
      name: "Funeral and memorial",
      iconName: "church",
      itemOrder: 1,
      description:"Plan and manage funeral or memorial services."
    },
  })
  
  await prisma.category.upsert({
    where: {name: "Notifications and contacts"},
    update: {},
    create: {
      name: "Notifications and contacts",
      iconName: "contact-mail",
      itemOrder: 2,
      description: "Notify organizations and manage accounts."
    }
  })


  await prisma.category.upsert({
    where: { name: "Legal and financial" },
    update: {},
    create: {
      name: "Legal and financial",
      iconName: "account-balance",
      itemOrder: 3,
      description:"Address wills, estates, insurance, and financial assets."
    },
  })

  await prisma.category.upsert({
    where: {name:"Personal well being"},
    update:{},
    create:{
      name: "Personal well being",
      iconName: "spa",
      itemOrder: 4,
      description: "Resources for grief support and self-care."
    }
  })



  const digitalLegacy = await prisma.category.upsert({
    where: { name: "Digital legacy" },
    update: {},
    create: {
      name: "Digital legacy",
      iconName: "devices",
      itemOrder: 5,
      description:"Manage online accounts, social media, and digital assets."
    },
  })

  await prisma.category.upsert({
    where: {name:"New partnership"},
    update:{},
    create:{
      name: "New partnership",
      iconName: "spa",
      itemOrder: 6,
      description:"Partnership is a test category."
    }
  })

  await prisma.category.upsert({
    where: {name:"Family death"},
    update:{},
    create:{
      name: "Family death",
      iconName: "insert-drive-file",
      itemOrder: 7,
      description: "Issues related to family death"
    }
  })

  const checklistExist = await prisma.checklist.findFirst({where: {
    name: "Create a list of online accounts"
  }})
  let checklist
  if (!checklistExist) {
    checklist = await prisma.checklist.create({ // use create because itemOrder can be duplicated
      data: {
        name: "Create a list of online accounts",
        categoryId: funeralAndMemorial.id,
        itemOrder: 1
      }
    })
  }

  await prisma.serviceProvider.upsert({
    where: {name: "service provider"},
    update: {},
    create: {
      name: "service provider",
      categoryIds: [funeralAndMemorial.id],
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

  console.log({ user, funeralAndMemorial, digitalLegacy, checklist })
}

seed();