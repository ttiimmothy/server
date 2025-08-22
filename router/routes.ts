import {PrismaClient} from "@prisma/client";
import {Router} from "express";
import {CategoryController} from "@/controllers/CategoryController";
import {ChecklistController} from "@/controllers/ChecklistController";
import {DocumentController} from "@/controllers/DocumentController";
import {ServiceProviderController} from "@/controllers/ServiceProviderController";
import {LoginController} from "@/controllers/LoginController";
import {AuthMiddleware} from "@/middleware/AuthMiddleware";

const prisma = new PrismaClient();
const categoryController = new CategoryController(prisma);
const checklistController = new ChecklistController(prisma)
const documentController = new DocumentController(prisma)
const serviceProviderController = new ServiceProviderController(prisma);
const loginController = new LoginController(prisma)

const authMiddleware = new AuthMiddleware()

export const routes = Router();
routes.get("/categories", categoryController.getCategories);
routes.post("/category", categoryController.checkCategoryExist);
routes.post("/checklists", checklistController.getChecklistByCategoryId)
routes.post("/checklists/search", checklistController.searchCategoryAndChecklist)
routes.post("/documents", authMiddleware.verifyJsonWebToken, documentController.getDocuments)

routes.get("/serviceproviders", serviceProviderController.getServiceProviders)

routes.post("/users/login", loginController.login)
routes.get("/users/current/user", authMiddleware.verifyJsonWebToken, loginController.currentUser)
routes.get("/users/logout", loginController.currentUser)
routes.post("/users/register", loginController.register)
routes.post("/users/forget/password", loginController.forgetPassword)
routes.post("/users/reset/password", loginController.resetPassword)
routes.post("/users/login/google", loginController.googleLogin)