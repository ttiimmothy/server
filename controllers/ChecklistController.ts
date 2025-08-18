import {PrismaClient} from "@prisma/client";
import {Request, Response} from "express";

export class ChecklistController {
  constructor(public prisma:PrismaClient) {}

  getChecklistByCategoryId = async(req: Request, res: Response) => {
    const categoryId = req.body.categoryId;
    if (!categoryId) {
      res.status(404).json({message: "There is no category id"})
    }
    const categoryExist = await this.prisma.category.findUnique({where: {id: categoryId}})
    if(!categoryExist) {
      console.log()
      res.status(404).json({message: "Category can't be found"})
    }
    const checklist = await this.prisma.checklist.findMany({
      where: {
        categoryId,
      },
      orderBy: {itemOrder: "asc"}
    })
    res.json(checklist)
  }

  searchCategoryAndChecklist = async(req: Request, res: Response) => {
    const queryText = req.body.queryText;
    if (!queryText) {
      res.status(404).json({message: "There is no text for searching"})
    }

    const filterCategoryByText = await this.prisma.category.findMany({
      where: {
        name: {
          contains: queryText,
          mode: 'insensitive'
        }
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
        }
      },
      select: {
        categoryId: true
      }
    })

    const filterCategoryById = await this.prisma.category.findMany({
      where: {
        id: {
          in: filterCategoryByCHecklist.map(id => id.categoryId)
        }
      },
      select: {
        name: true
      }
    })
    const searchResult = [...new Set([...filterCategoryByText, ...filterCategoryById])]

    res.json(searchResult)
  }
}