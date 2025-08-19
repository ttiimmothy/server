import {PrismaClient} from "@prisma/client";
import {Router} from "express";
import {CategoryController} from "@/controllers/CategoryController";
import {ChecklistController} from "@/controllers/ChecklistController";
import {DocumentController} from "@/controllers/DocumentController";
import {ServiceProviderController} from "@/controllers/ServiceProviderController";
import {LoginController} from "@/controllers/LoginController";

const prisma = new PrismaClient();
const categoryController = new CategoryController(prisma);
const checklistController = new ChecklistController(prisma)
const documentController = new DocumentController(prisma)
const serviceProviderController = new ServiceProviderController(prisma);
const loginController = new LoginController(prisma)

export const routes = Router();
routes.get("/categories", categoryController.getCategories);
routes.post("/category", categoryController.checkCategoryExist);
routes.post("/checklist", checklistController.getChecklistByCategoryId)
routes.post("/checklist/search", checklistController.searchCategoryAndChecklist)
routes.post("/documents", documentController.getDocuments)
routes.get("/serviceproviders", serviceProviderController.getServiceProviders)
routes.post("/user/login", loginController.login)