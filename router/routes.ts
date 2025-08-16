import {PrismaClient} from "@prisma/client";
import {Router} from "express";
import {CategoryController} from "@/controllers/CategoryController";
import {ChecklistController} from "@/controllers/ChecklistController";
import {DocumentController} from "@/controllers/DocumentController";

const prisma = new PrismaClient();
const categoryController = new CategoryController(prisma);
const checklistController = new ChecklistController(prisma)
const documentController = new DocumentController(prisma)

export const routes = Router();
routes.get("/categories", categoryController.getCategories);
routes.post("/checklist", checklistController.getChecklistByCategoryId)
routes.post("/checklist/search", checklistController.searchCategoryAndChecklist)
routes.post("/documents", documentController.getDocuments)