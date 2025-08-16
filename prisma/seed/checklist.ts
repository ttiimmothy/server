import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient;

const checklist = async () => {
  const category = await prisma.category.findUnique({where: {title: "Family death"}, select: {id: true}})
  const user = await prisma.user.findUnique({where: {email: "timothyemail805@gmail.com"}, select: {id: true}})

  if (category && user) {
    const checklistExist1 = await prisma.checklist.findFirst({where: {title: "Confirm and Certify Death"}})
    if (!checklistExist1) {
      await prisma.checklist.create({
        data: {
          title: "Confirm and Certify Death",
          categoryId: category.id,
          itemOrder: 1,
          userId: user.id
        }
      })
    }

    const checklistExist2 = await prisma.checklist.findFirst({where: {title: "Register the Death"}})
    if (!checklistExist2) {
      await prisma.checklist.create({
        data: {
          title: "Register the Death",
          categoryId: category.id,
          itemOrder: 2,
          userId: user.id
        }
      })
    }

    const checklistExist3 = await prisma.checklist.findFirst({where: {title: "Funeral Arrangements"}})
    if (!checklistExist3) {
      await prisma.checklist.create({
        data: {
          title: "Funeral Arrangements",
          categoryId: category.id,
          itemOrder: 3,
          userId: user.id
        }
      })
    }
    const checklistExist4 = await prisma.checklist.findFirst({where: {title: "Notify Family and Friends"}})
    if (!checklistExist4) {
      await prisma.checklist.create({
        data: {
          title: "Notify Family and Friends",
          categoryId: category.id,
          itemOrder: 4,
          userId: user.id
        }
      })
    }

    const checklistExist5 = await prisma.checklist.findFirst({where: {title: "Consider Organ and Tissue Donation"}})
    if (!checklistExist5) {
      await prisma.checklist.create({
        data: {
          title: "Consider Organ and Tissue Donation",
          categoryId: category.id,
          itemOrder: 5,
          userId: user.id
        }
      })
    }
    
    const checklistExist6 = await prisma.checklist.findFirst({where: {title: "Identify the Legal Representative"}})
    if (!checklistExist6) {
      await prisma.checklist.create({
        data: {
          title: "Identify the Legal Representative",
          categoryId: category.id,
          itemOrder: 6,
          userId: user.id
        }
      })
    }

    const checklistExist7 = await prisma.checklist.findFirst({where: {title: "Consult with Legal and Financial Professionals"}})
    if (!checklistExist7) {
      await prisma.checklist.create({
        data: {
          title: "Consult with Legal and Financial Professionals",
          categoryId: category.id,
          itemOrder: 7,
          userId: user.id
        }
      })
    }
    const checklistExist8 = await prisma.checklist.findFirst({where: {title: "Understand the Division of Property"}})
    if (!checklistExist8) {
      await prisma.checklist.create({
        data: {
          title: "Understand the Division of Property",
          categoryId: category.id,
          itemOrder: 8,
          userId: user.id
        }
      })
    }
    const checklistExist9 = await prisma.checklist.findFirst({where: {title: "Claim Entitlements"}})
    if (!checklistExist9) {
      await prisma.checklist.create({
        data: {
          title: "Claim Entitlements",
          categoryId: category.id,
          itemOrder: 9,
          userId: user.id
        }
      })
    }
    const checklistExist10 = await prisma.checklist.findFirst({where: {title: "Notify Government Agencies"}})
    if (!checklistExist10) {
      await prisma.checklist.create({
        data: {
          title: "Notify Government Agencies",
          categoryId: category.id,
          itemOrder: 10,
          userId: user.id
        }
      })
    }

    const checklistExist11 = await prisma.checklist.findFirst({where: {title: "Close Accounts and Subscriptions"}})
    if (!checklistExist11) {
      await prisma.checklist.create({
        data: {
          title: "Close Accounts and Subscriptions",
          categoryId: category.id,
          itemOrder: 11,
          userId: user.id
        }
      })
    }

    const checklistExist12 = await prisma.checklist.findFirst({where: {title: "Obtain Death Certificates"}})
    if (!checklistExist12) {
      await prisma.checklist.create({
        data: {
          title: "Obtain Death Certificates",
          categoryId: category.id,
          itemOrder: 12,
          userId: user.id
        }
      })
    }

    const checklistExist13 = await prisma.checklist.findFirst({where: {title: "Manage Finances"}})
    if (!checklistExist13) {
      await prisma.checklist.create({
        data: {
          title: "Manage Finances",
          categoryId: category.id,
          itemOrder: 13,
          userId: user.id
        }
      })
    }

    const checklistExist14 = await prisma.checklist.findFirst({where: {title: "Deal with Real Estate"}})
    if (!checklistExist14) {
      await prisma.checklist.create({
        data: {
          title: "Deal with Real Estate",
          categoryId: category.id,
          itemOrder: 14,
          userId: user.id
        }
      })
    }

    const checklistExist15 = await prisma.checklist.findFirst({where: {title: "Protect Against Fraud"}})
    if (!checklistExist15) {
      await prisma.checklist.create({
        data: {
          title: "Protect Against Fraud",
          categoryId: category.id,
          itemOrder: 15,
          userId: user.id
        }
      })
    }

    const checklistExist16 = await prisma.checklist.findFirst({where: {title: "Return Documents"}})
    if (!checklistExist16) {
      await prisma.checklist.create({
        data: {
          title: "Return Documents",
          categoryId: category.id,
          itemOrder: 16,
          userId: user.id
        }
      })
    }

    const checklistExist17 = await prisma.checklist.findFirst({where: {title: "Coping with Grief"}})
    if (!checklistExist17) {
      await prisma.checklist.create({
        data: {
          title: "Coping with Grief",
          categoryId: category.id,
          itemOrder: 17,
          userId: user.id
        }
      })
    }
  }
}

checklist()