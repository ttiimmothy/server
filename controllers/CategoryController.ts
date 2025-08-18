import {PrismaClient} from "@prisma/client";
import {Request, Response} from "express";

export class CategoryController {
  constructor(public prisma: PrismaClient) {}
  
  getCategories = async(req: Request, res:Response) => {
    const categories = await this.prisma.category.findMany({
      where: {
        isDeleted: false
      }, 
      orderBy: {
        itemOrder: "asc"
      }
    })
    res.json(categories)
  }

  checkCategoryExist = async(req: Request, res: Response) => {
    const categoryId = req.body.categoryId
    const category = await this.prisma.category.findUnique({
      where: {
        id: categoryId
      }
    })
    res.json(category)
  }
}