import {PrismaClient} from "@prisma/client";
import {raw, Router} from "express";
import {CategoryController} from "@/controllers/CategoryController";
import {ChecklistController} from "@/controllers/ChecklistController";
import {DocumentController} from "@/controllers/DocumentController";
import {ServiceProviderController} from "@/controllers/ServiceProviderController";
import {LoginController} from "@/controllers/LoginController";
import {AuthMiddleware} from "@/middleware/AuthMiddleware";
import {UserController} from "@/controllers/UserController";
import {MembershipController} from "@/controllers/MembershipController";

export const prisma = new PrismaClient();
const categoryController = new CategoryController(prisma);
const checklistController = new ChecklistController(prisma)
const documentController = new DocumentController(prisma)
const serviceProviderController = new ServiceProviderController(prisma);
const loginController = new LoginController(prisma)
const userController = new UserController(prisma)
const membershipController = new MembershipController(prisma)

const authMiddleware = new AuthMiddleware()

export const routes = Router();

routes.get("/categories", categoryController.getCategories);
routes.get("/category/:id", categoryController.checkCategory);

routes.post("/checklists", checklistController.getChecklistByCategoryId)
routes.put("/checklists/category/:categoryId",  authMiddleware.verifyJsonWebToken, checklistController.updateChecklistCompletedState)
// routes.post("/checklists/search", checklistController.searchCategoryAndChecklist)

routes.post("/documents", authMiddleware.verifyJsonWebToken, documentController.getDocuments)

routes.get("/serviceproviders", serviceProviderController.getServiceProviders)
routes.put("/serviceproviders/favorite", authMiddleware.verifyJsonWebToken, serviceProviderController.updateUserFavoriteServiceProvider)
routes.get("/serviceprovider/:id", serviceProviderController.checkServiceProvider)
routes.get("/serviceprovider/favorite/:userId/:serviceProviderId", serviceProviderController.checkFavoriteServiceProvider)

routes.post("/users/login", loginController.login)
routes.get("/users/current/user", authMiddleware.verifyJsonWebToken, loginController.currentUser)
// routes.get("/users/logout", loginController.currentUser)
routes.post("/users/register", loginController.register)
routes.post("/users/forget/password", loginController.forgetPassword)
routes.post("/users/reset/password", loginController.resetPassword)
routes.post("/users/login/google", loginController.googleLogin)

routes.get("/users/info/user/:id", authMiddleware.verifyJsonWebToken, userController.getUserInformation)
routes.put("/users/info/user/:id", authMiddleware.verifyJsonWebToken, userController.updateUserInformation)
// check user exist for deleting that user account
routes.post("/users/check/user/:id", authMiddleware.verifyJsonWebToken, userController.checkUser)
routes.put("/users/change/password/user/:id", authMiddleware.verifyJsonWebToken, userController.changePassword)

routes.delete("/user/:id", userController.deleteUser)

routes.get("/memberships/user/:id", authMiddleware.verifyJsonWebToken, membershipController.getMembership)
routes.put("/memberships/user", authMiddleware.verifyJsonWebToken, membershipController.updateMembership)
routes.delete("/memberships/user", authMiddleware.verifyJsonWebToken, membershipController.cancelSubscription)
routes.post("/memberships/stripe/setupintent/:id", authMiddleware.verifyJsonWebToken, membershipController.getCustomerAndSetupIntent)
routes.post("/memberships/stripe/subscription", authMiddleware.verifyJsonWebToken, membershipController.stripeSubscribe)

routes.get("/memberships/plans", membershipController.getAvailablePlans)