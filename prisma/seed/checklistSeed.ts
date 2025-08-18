import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient;

const checklist = async () => {
  const category = await prisma.category.findUnique({where: {name: "Family death"}, select: {id: true}})
  const user = await prisma.user.findUnique({where: {email: "timothyemail805@gmail.com"}, select: {id: true}})

  if (category && user) {
    const checklistExist1 = await prisma.checklist.findFirst({where: {name: "Confirm and Certify Death"}})
    if (!checklistExist1) {
      const confirm = await prisma.checklist.create({
        data: {
          name: "Confirm and Certify Death",
          categoryId: category.id,
          itemOrder: 1,
          userId: user.id
        }
      })
      console.log(confirm)
    }

    const checklistExist2 = await prisma.checklist.findFirst({where: {name: "Register the Death"}})
    if (!checklistExist2) {
      await prisma.checklist.create({
        data: {
          name: "Register the Death",
          categoryId: category.id,
          itemOrder: 2,
          userId: user.id
        }
      })
    }

    const checklistExist3 = await prisma.checklist.findFirst({where: {name: "Funeral Arrangements"}})
    if (!checklistExist3) {
      await prisma.checklist.create({
        data: {
          name: "Funeral Arrangements",
          categoryId: category.id,
          itemOrder: 3,
          userId: user.id
        }
      })
    }
    const checklistExist4 = await prisma.checklist.findFirst({where: {name: "Notify Family and Friends"}})
    if (!checklistExist4) {
      await prisma.checklist.create({
        data: {
          name: "Notify Family and Friends",
          categoryId: category.id,
          itemOrder: 4,
          userId: user.id
        }
      })
    }

    const checklistExist5 = await prisma.checklist.findFirst({where: {name: "Consider Organ and Tissue Donation"}})
    if (!checklistExist5) {
      await prisma.checklist.create({
        data: {
          name: "Consider Organ and Tissue Donation",
          categoryId: category.id,
          itemOrder: 5,
          userId: user.id
        }
      })
    }
    
    const checklistExist6 = await prisma.checklist.findFirst({where: {name: "Identify the Legal Representative"}})
    if (!checklistExist6) {
      await prisma.checklist.create({
        data: {
          name: "Identify the Legal Representative",
          categoryId: category.id,
          itemOrder: 6,
          userId: user.id
        }
      })
    }

    const checklistExist7 = await prisma.checklist.findFirst({where: {name: "Consult with Legal and Financial Professionals"}})
    if (!checklistExist7) {
      await prisma.checklist.create({
        data: {
          name: "Consult with Legal and Financial Professionals",
          categoryId: category.id,
          itemOrder: 7,
          userId: user.id
        }
      })
    }
    const checklistExist8 = await prisma.checklist.findFirst({where: {name: "Understand the Division of Property"}})
    if (!checklistExist8) {
      await prisma.checklist.create({
        data: {
          name: "Understand the Division of Property",
          categoryId: category.id,
          itemOrder: 8,
          userId: user.id
        }
      })
    }
    const checklistExist9 = await prisma.checklist.findFirst({where: {name: "Claim Ennamements"}})
    if (!checklistExist9) {
      await prisma.checklist.create({
        data: {
          name: "Claim Ennamements",
          categoryId: category.id,
          itemOrder: 9,
          userId: user.id
        }
      })
    }
    const checklistExist10 = await prisma.checklist.findFirst({where: {name: "Notify Government Agencies"}})
    if (!checklistExist10) {
      await prisma.checklist.create({
        data: {
          name: "Notify Government Agencies",
          categoryId: category.id,
          itemOrder: 10,
          userId: user.id
        }
      })
    }

    const checklistExist11 = await prisma.checklist.findFirst({where: {name: "Close Accounts and Subscriptions"}})
    if (!checklistExist11) {
      await prisma.checklist.create({
        data: {
          name: "Close Accounts and Subscriptions",
          categoryId: category.id,
          itemOrder: 11,
          userId: user.id
        }
      })
    }

    const checklistExist12 = await prisma.checklist.findFirst({where: {name: "Obtain Death Certificates"}})
    if (!checklistExist12) {
      await prisma.checklist.create({
        data: {
          name: "Obtain Death Certificates",
          categoryId: category.id,
          itemOrder: 12,
          userId: user.id
        }
      })
    }

    const checklistExist13 = await prisma.checklist.findFirst({where: {name: "Manage Finances"}})
    if (!checklistExist13) {
      await prisma.checklist.create({
        data: {
          name: "Manage Finances",
          categoryId: category.id,
          itemOrder: 13,
          userId: user.id
        }
      })
    }

    const checklistExist14 = await prisma.checklist.findFirst({where: {name: "Deal with Real Estate"}})
    if (!checklistExist14) {
      await prisma.checklist.create({
        data: {
          name: "Deal with Real Estate",
          categoryId: category.id,
          itemOrder: 14,
          userId: user.id
        }
      })
    }

    const checklistExist15 = await prisma.checklist.findFirst({where: {name: "Protect Against Fraud"}})
    if (!checklistExist15) {
      await prisma.checklist.create({
        data: {
          name: "Protect Against Fraud",
          categoryId: category.id,
          itemOrder: 15,
          userId: user.id
        }
      })
    }

    const checklistExist16 = await prisma.checklist.findFirst({where: {name: "Return Documents"}})
    if (!checklistExist16) {
      await prisma.checklist.create({
        data: {
          name: "Return Documents",
          categoryId: category.id,
          itemOrder: 16,
          userId: user.id
        }
      })
    }

    const checklistExist17 = await prisma.checklist.findFirst({where: {name: "Coping with Grief"}})
    if (!checklistExist17) {
      await prisma.checklist.create({
        data: {
          name: "Coping with Grief",
          categoryId: category.id,
          itemOrder: 17,
          userId: user.id
        }
      })
    }
  }
}

checklist()