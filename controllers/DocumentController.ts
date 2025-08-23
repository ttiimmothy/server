import {PrismaClient} from "@prisma/client";
import {Request, Response} from "express";

const normalizeTags = (input: any) => {
  if (!input || input === "") {
    return undefined; // treat empty string or undefined as “no filter”
  }
  if (Array.isArray(input)) {
    return input; // valid array
  }
  // If a single string, wrap in array
  return [input];
}

export class DocumentController {
  constructor(public prisma: PrismaClient) {}

  getDocuments = async (req: Request, res: Response) => {
    const {
      userId,
      categoryId,
      tags,
      searchTerm,
      sortBy,
      sortDirection
    } = req.body
    const tagsFilter = normalizeTags(tags);

    const documents = await this.prisma.document.findMany({
      where: {
        userId,
        categoryId,
        ...(tagsFilter
          ? { tags: { array_contains: tagsFilter } }
          : {}), // only add filter if tags exist
        isDeleted: false
      },
      orderBy: {
        [sortBy]: sortDirection
      }
    })

    if (searchTerm) {
      documents.filter(document => document.name.includes(searchTerm))
    }

    res.json(documents)
  }
}