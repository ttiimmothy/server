import {PrismaClient} from "@prisma/client";
import {Request, Response} from "express";

export class ChecklistController {
  constructor(public prisma:PrismaClient) {}

  getChecklistByCategoryId = async(req: Request, res: Response) => {
    const {userId, categoryId} = req.body;
    if (!categoryId) {
      res.status(400).json({error: "There is no category id"})
      return
    }

    const categoryExist = await this.prisma.category.findUnique({where: {id: categoryId}})
    if(!categoryExist) {
      res.status(400).json({error: "Category can't be found"})
      return
    }

    const checklist = await this.prisma.checklist.findMany({
      where: {
        categoryId,
        isDeleted: false
      },
      orderBy: {itemOrder: "asc"}
    })

    for (const i of checklist) {
      const completeChecklist = await this.prisma.userCompleteChecklist.findFirst({
        where: {
          userId,
          checklistId: i.id
        }
      })
      if (!completeChecklist) {
        await this.prisma.userCompleteChecklist.create({
          data:{
            userId,
            checklistId: i.id
          }
        })
      }
    }
    const newChecklist = await this.prisma.checklist.findMany({
      include:{
        completions: {
          where: {userId},
          select: {
            isCompleted: true
          }
        }
      },
      where: {
        categoryId,
        isDeleted: false
      },
      orderBy: {itemOrder: "asc"}
    })
    const result = newChecklist.map(({completions, ...checklist}) => ({...checklist, isCompleted: completions[0]?.isCompleted ?? false}))

    res.json(result)
  }

  searchCategoryAndChecklist = async(req: Request, res: Response) => {
    const queryText = req.body.queryText;
    if (!queryText) {
      res.status(400).json({error: "There is no text for searching"})
      return
    }

    const filterCategoryByText = await this.prisma.category.findMany({
      where: {
        name: {
          contains: queryText,
          mode: 'insensitive'
        },
        isDeleted: false
      },
      select: {
        name: true
      }
    })
    const filterCategoryByCHecklist = await this.prisma.checklist.findMany({
      where: {
        name: {
          contains: queryText,
          mode: 'insensitive'
        },
        isDeleted: false
      },
      select: {
        categoryId: true
      }
    })

    const filterCategoryById = await this.prisma.category.findMany({
      where: {
        id: {
          in: filterCategoryByCHecklist.map(id => id.categoryId)
        },
        isDeleted: false
      },
      select: {
        name: true
      }
    })
    const searchResult = [...new Set([...filterCategoryByText, ...filterCategoryById])]

    res.json(searchResult)
  }

  updateChecklistCompletedState = async (req:Request, res: Response) => {
    const { categoryId } = req.params
    const { userId, itemId, isCompleted } = req.body

    if (!categoryId) {
      res.status(400).json({error: "category id is missing"})
      return
    }

    if (!userId || !itemId || isCompleted === undefined) {
      res.status(400).json({error: "There is no user id or no checklist id or isCompleted status for update"})
      return
    }

    const checklistFound = await this.prisma.checklist.findMany({
      where: {
        id: itemId,
        categoryId
      }
    })

    if (!checklistFound) {
      res.status(401).json({error: "There is no this checklist"})
      return
    }

    const completeChecklist = await this.prisma.userCompleteChecklist.findFirst({
      where: {
        userId,
        checklistId: itemId
      }
    })

    await this.prisma.userCompleteChecklist.update({
      where: {
        id: completeChecklist.id
      },
      data: { isCompleted }
    })

    res.json({message: "The checklist complete status update success"})
  }
}