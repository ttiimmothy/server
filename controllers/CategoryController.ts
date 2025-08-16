import {PrismaClient} from "@prisma/client";
import {Request, Response} from "express";

export class CategoryController {
  constructor(public prisma: PrismaClient) {}
  
  getCategories = async(req: Request, res:Response) => {
    const categories = await this.prisma.category.findMany({
      where: {
        isActive: true
      }, 
      orderBy: {
        itemOrder: "asc"
      }
    })
    res.json(categories)
  }
}